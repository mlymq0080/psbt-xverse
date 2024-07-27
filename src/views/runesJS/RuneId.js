const { U32, U64 } = require("big-varuint-js");

class RuneId {
  constructor(block, tx) {
    this.block = block;
    this.tx = tx;
  }

  delta(next) {
    const block = next.block.toValue() - this.block.toValue();
    let tx = next.tx.toValue();
    if (block === 0n) {
      tx -= this.tx.toValue();
    }

    return new RuneId(new U64(block), new U32(tx));
  }

  next(next) {
    const block = this.block.toValue() + next.block.toValue();
    const tx =
      next.block.toValue() === 0n
        ? this.tx.toValue() + next.tx.toValue()
        : next.tx.toValue();

    return new RuneId(new U64(block), new U32(tx));
  }

  toJSON() {
    return {
      block: this.block.toString(),
      tx: this.tx.toString(),
    };
  }
}


export { RuneId };