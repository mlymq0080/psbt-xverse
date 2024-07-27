<template>
  



</template>

<script>
import  Wallet,{BitcoinNetworkType, getAddress, AddressPurpose,signTransaction,signMessage, sendBtcTransaction} from "sats-connect"
import * as btc from '@scure/btc-signer'
import { hex, base64 } from '@scure/base'
 import axios from "axios";
 import * as bscript from 'bitcoinjs-lib';
import { Runestone } from "./runesJS/Runestone.js";
import { RuneId } from "./runesJS/RuneId.js";
import { SendRunestone,Edict } from "./runesJS/build.js";

export default {
    name: 'psbtRunes',
    components: {

    },
    
    data() {
      return {
        wallet: false,
        recipient:"", //转给对方符文地址,
      }
    },
  
    created() {
      //解析符文脚本得到buffer数组 
      // console.log(hex.decode('6a5d0a160200dfd133b2136401'))


      // //解析脚本得到符文石
      // const runestone = Runestone.dechiper(hex.decode('160200dfd133b213e0d40301'));
      // console.log(runestone)
      // console.log(JSON.stringify(runestone))
     
      
     // 构建符石脚本
      // const runeId =  new RuneId(846047,2482);
      // const edict = new Edict(runeId, 1, 1);
      // const sendRunestone = new SendRunestone([edict], 2,undefined,undefined);
      // const runestone1  = Runestone.encode(sendRunestone)
      // const buffer = runestone1.enchiper();
      // const opReturnScript = bscript.script.compile([bscript.opcodes.OP_RETURN, bscript.opcodes.OP_13,buffer])
      // console.log(opReturnScript)
      
    
  
    },
    mounted(){
      //测试符文PSBT发送转账给别人
      this.RunesPsbt()
    },
    methods: {

        async RunesPsbt() {
          let addresses = []
    // 获取地址
    await getAddress({
      payload: {
      	// 这两都要
        purposes: [      //字符串数组，用于指定请求地址的目的
                 AddressPurpose.Payment,  // 比特币地址
                 AddressPurpose.Ordinals, // 序数地址(符文地址)
               ],
        message: 'Address for receiving Ordinals',
        network: {
          // type: BitcoinNetworkType.Testnet  //测试网地址
          type: BitcoinNetworkType.Mainnet //正式网地址
        }
      },
      onFinish: (response) => {
        //获取地址数组 /address 地址 addressType地址类型 publicKey 公钥 purpose 目的类型
        addresses = response.addresses
        console.log('地址', addresses)
        this.queryWitnessUtxo(addresses)
        
      },
      onCancel: () => {
        console.log('取消')
      }
    })



       },
           queryWitnessUtxo(addresses){
             const url = "https://mempool.space/api/address/"+addresses[0].address+"/utxo"; //btc地址
                   axios.get(url).then(res => {
                
                
                  if(res.data.length  === 0){
                      return ""
                  }else{
                    //获得所有UTXO未输出的
                    const btcUTXO = res.data.reduce((max, current) => (max.value > current.value) ? max : current);
                    const url1 = "https://mempool.space/api/address/"+addresses[1].address+"/utxo"; 
                   axios.get(url1).then(res1 => {
                
                
                  if(res1.data.length  === 0){
                      return ""
                  }else{
                      //获得所有符文UTXO未输出的，这个只是例子，需要把燃烧掉的符文从这里排除出去，这个地方没有排除需要自己改进
                    const RunesUXTO = res1.data.reduce((max, current) => (max.value > current.value) ? max : current);
                    const freeUrl = "https://mempool.space/api/v1/fees/recommended";

                        axios.get(freeUrl).then(res => {

                          //获取最新建议手续费 
                          const fastestFee = res.data.fastestFee

                          this.RunesSign(addresses,btcUTXO,RunesUXTO,fastestFee)
                                }).catch(err => {
                                  console.log(err)
                                })
                 
                  }
                  
              }).catch(err => {
                console.log(err)
              })
                 
                  }
                  
              }).catch(err => {
                console.log(err)
              })
        
      
       },

//转符文
async RunesSign(addresses,btcUTXO,runesUTXO,fastestFee){



  
const createPsbt = (addresses,btcUTXO,runesUTXO,fastestFee) => {
 // https://github.com/paulmillr/scure-btc-signer psbt里有tx相关demo
 const tx = new btc.Transaction({
  allowUnknownOutputs: true, // 添加自定义脚本时，输出为允许状态
 })

 //正式网
 const bitcoinTestnet = {
   bech32: 'bc',
   pubKeyHash: 0x00,
   scriptHash: 0x05,
   wif: 0x80
 }


const outputBTCUTXO = btcUTXO
const outputRunesUTXO = runesUTXO

 // 使用 Taproot (P2TR) 地址创建交易 SegWit Taproot 标志 (开源推荐使用)

  const internalPubKey = hex.decode(addresses[1].publicKey)
  const p2tr = btc.p2tr(internalPubKey, undefined, bitcoinTestnet)
  tx.addInput({
    txid: outputRunesUTXO.txid,
    index: outputRunesUTXO.vout,
    witnessUtxo: {
      script: p2tr.script,
      amount: BigInt(outputRunesUTXO.value)
    },
    tapInternalKey: internalPubKey,
    sighashType: btc.SigHash.DEFAULT
  })


   //使用包装隔离验证 (P2SH-P2WPHK) 地址创建交易 SegWit 标志
  // addresses[1].publicKey 就是 payment publicKey，在获取地址时拿到
  const publicKey = hex.decode(addresses[0].publicKey)
  const p2wpkh = btc.p2wpkh(publicKey, bitcoinTestnet)
  const p2sh = btc.p2sh(p2wpkh, bitcoinTestnet)
  tx.addInput({
    txid: outputBTCUTXO.txid,
    index: outputBTCUTXO.vout,
    witnessUtxo: {
      script: p2sh.script,
      amount: BigInt(outputBTCUTXO.value)
    },
    redeemScript: p2sh.redeemScript
  })


  
 const changeAddress = addresses[0].address  //自己btc账户地址
 const myRunesAddress = addresses[1].address


 const runeId =  new RuneId(846047,2482);
 const edict = new Edict(runeId, 1, 1);
 const sendRunestone = new SendRunestone([edict], 2,undefined,undefined);
 const runestone1  = Runestone.encode(sendRunestone)
 const buffer = runestone1.enchiper();
 const opReturnScript = bscript.script.compile([bscript.opcodes.OP_RETURN, bscript.opcodes.OP_13,buffer])

  // 添加自定义脚本 备注amount为0
  tx.addOutput({
    script:  opReturnScript,
    amount: 0n,
  });
  
  //符文地址金额
  tx.addOutputAddress(this.recipient, BigInt(outputRunesUTXO.value), bitcoinTestnet)
 //符文地址金额
 tx.addOutputAddress(myRunesAddress, BigInt(outputRunesUTXO.value), bitcoinTestnet)


 
   //手续费 输入个数 * 148 + 输出个数 * 44 + 10 (+1为最后找零，好计算前面字节大小)
//  手续费=字节数*  X satoshis / byte
const sizes = tx.inputsLength * 148 + (tx.outputsLength ) * 44 + 10
const sxf = sizes * fastestFee
const zhamount = outputBTCUTXO.value  - sxf

 //转给自己btci地址金额
 tx.addOutputAddress(changeAddress, BigInt(zhamount), bitcoinTestnet)
 
 
  
 const psbt = tx.toPSBT(0)
 const psbtB64 = base64.encode(psbt)
console.log('psbtB64是：'+psbtB64)
 return psbtB64
}



 await signTransaction({
  payload: {
    network: {
         type: BitcoinNetworkType.Mainnet //正式网地址
    },
  // 调用生成Psbt函数
    psbtBase64: createPsbt(addresses,btcUTXO,runesUTXO,fastestFee),
    broadcast: true,
    inputsToSign: [
    {
    
        address: addresses[1].address,  //符文地址
        signingIndexes: [0]    //符文索引
      },
      {
    
        address: addresses[0].address,  //自己btc地址
        signingIndexes: [1]    //自己btc索引
      }
    ]
  },
  onFinish: (response) => {
 
   //  data.signatureBase64 = response.psbtBase64
    console.log('签名', response)
  },
  onCancel: () => {
    console.log('sign cancel')
  }
})


},



     

    }
  }
</script>


