const { U8 } = require("big-varuint-js");

const FlagEnum = {
  Etching: 0,
  Terms: 1,
  Cenotaph: 127,
};

class Flag {
  constructor(value) {
    this.flag = value;
  }

  set(flag) {
    const mask = 1n << BigInt(flag);
    this.flag = new U8(this.flag.toValue() | mask);
  }

  hasFlag(flag) {
    const mask = 1n << BigInt(flag);
    return (this.flag.toValue() & mask) !== 0n;
  }

  toValue() {
    return this.flag;
  }
}
export { FlagEnum, Flag };

