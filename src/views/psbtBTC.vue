<template>
  
</template>

<script>
import  Wallet,{BitcoinNetworkType, getAddress, AddressPurpose,signTransaction} from "sats-connect"
import * as btc from '@scure/btc-signer'
import { hex, base64 } from '@scure/base'
 import axios from "axios";
 import {Buffer} from "buffer";
export default {
    name: 'psbtBTC',
    components: {

    },
    
    data() {
      return {
        wallet: false,
        address: "",
        recipient:"" //转给对方btc地址
      }
    },
  
    created() {
     
    },
    mounted(){
      //测试PSBT发送转账BTC给别人
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
        //mempool方法
       queryWitnessUtxo(addresses){
        //查询未自己地址未花费的UTXO
        const url = "https://mempool.space/api/address/"+addresses[0].address+"/utxo"; //btc地址
        axios.get(url).then(res => {
         
         
           if(res.data.length  === 0){
              return ""
           }else{
            //获得所有UTXO未输出的
            let unspentOutputs = res.data 

            // 找到所有UTXO未输出的，并找到最大的UTXO
            const maxTransaction = unspentOutputs.reduce((max, current) => (max.value > current.value) ? max : current);
           
            const freeUrl = "https://mempool.space/api/v1/fees/recommended";

            axios.get(freeUrl).then(res => {

               //获取最新建议手续费 
              let fastestFee = res.data.fastestFee
              this.sign(addresses,maxTransaction,fastestFee) //PSBT 普通转 BTC
                        
                    }).catch(err => {
                      console.log(err)
                    })


            
           }
           
      }).catch(err => {
        console.log(err)
      })
       },

      //PSBT转普通btc
async sign(addresses,unspentOutputs,fastestFee){



  
 const createPsbt = (addresses,unspentOutputs,fastestFee) => {

  // const tx = new btc.Transaction()

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

 
const output = unspentOutputs

  //使用包装隔离验证 (P2SH-P2WPHK) 地址创建交易 SegWit 标志
  // addresses[1].publicKey 就是 payment publicKey，在获取地址时拿到
  const publicKey = hex.decode(addresses[0].publicKey)
  const p2wpkh = btc.p2wpkh(publicKey, bitcoinTestnet)
  const p2sh = btc.p2sh(p2wpkh, bitcoinTestnet)
  

  tx.addInput({
    txid: output.txid,
    index: output.vout,
    witnessUtxo: {
      script: p2sh.script,
      amount: BigInt(output.value)
    },
    redeemScript: p2sh.redeemScript
  })

  const changeAddress = addresses[0].address  //自己btc账户地址

 //创建op_retrun 脚本 ,添加备注
  const opRetunScprit1 = btc.Script.encode([btc.OP.RETURN, Buffer.from('hello,world')]);
  //op_retrun byte数组里是106开头 所以要把第一个数组取掉
  //构成成 op_retrun data字节数  data数据
    let opRetunScprit = opRetunScprit1.slice(1)
    

  // 添加自定义脚本 备注amount为0
  tx.addOutput({
  script:  opRetunScprit,
  amount: 0n,
});

  //给别人的金额 BigInt(1000) 为1000聪
  tx.addOutputAddress(this.recipient, BigInt(1000), bitcoinTestnet)

 

   //手续费 输入个数 * 148 + 输出个数 * 44 + 10 (+1为最后找零，好计算前面字节大小)
//  手续费=字节数*  X satoshis / byte
  const sizes = tx.inputsLength * 148 + (tx.outputsLength +1) * 44 + 10
const sxf = sizes * fastestFee
//UTXO的聪- 转给别人的聪 - gas费
const zhamount = output.value - 1000 - sxf

  //返回自己的金额
  tx.addOutputAddress(changeAddress, BigInt(zhamount), bitcoinTestnet)
  
  const psbt = tx.toPSBT(0)
  const psbtB64 = base64.encode(psbt)
console.log('psbtB64是：'+psbtB64)
  return psbtB64
}


  await signTransaction({
   payload: {
     network: {
      //  type: BitcoinNetworkType.Testnet  //测试网地址
          type: BitcoinNetworkType.Mainnet //正式网地址
     },
	 // 调用生成Psbt函数
     psbtBase64: createPsbt(addresses,unspentOutputs,fastestFee),
     broadcast: true,
     inputsToSign: [
       {
       	// 这里为 payment address. payment address 在获取的值的时候拿到
         address: addresses[0].address,  //自己btc地址
         signingIndexes: [0]    //自己btc索引
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

