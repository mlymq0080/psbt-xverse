import * as bscript from 'bitcoinjs-lib';



class SendRunestone {
    constructor(edicts, pointer,mint,etching) {
        this.edicts = edicts;
        this.pointer = pointer; //Pointer 字段包含应将法令未分配的符文传输到的输出索引。如果 Pointer 字段不存在，则未分配的符文将传输到第一个非 OP_RETURN 输出。
        this.mint = mint;
      this.etching = etching;
    }
}

class Edict {
    constructor(id, amount, output) {
        this.id = id;
        this.amount = amount;
        this.output = output;
    }
}


export { SendRunestone,Edict };