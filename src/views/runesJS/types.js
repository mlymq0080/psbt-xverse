import { RuneId } from "./RuneId";
import { Rune } from "./Rune";
import { Symbol } from "./Symbol";

// 定义 RuneId 类
class RuneId {}

// 定义 Rune 类
class Rune {}

// 定义 Symbol 类
class Symbol {}

// 定义 Edict 类
class Edict {
  constructor(id, amount, output) {
    this.id = id; // id
    this.amount = amount; // 数量
    this.output = output; // 输出
  }
}

// 定义 Terms 类
class Terms {
  constructor(amount, cap, height, offset) {
    this.amount = amount; // 数量
    this.cap = cap; // 上限
    this.height = height; // 高度
    this.offset = offset; // 偏移量
  }
}

// 定义 Etching 类
class Etching {
  constructor(divisibility, premine, rune, spacers, symbol, terms) {
    this.divisibility = divisibility; // 可分性
    this.premine = premine; // 预挖
    this.rune = rune; // 符文
    this.spacers = spacers; // 间隔器
    this.symbol = symbol; // 符号
    this.terms = terms; // 条款
  }
}

// 定义 RunestoneParams 类
class RunestoneParams {
  constructor(edicts, etching, mint, pointer) {
    this.edicts = edicts; // 法令
    this.etching = etching; // 雕刻
    this.mint = mint; // 铸币
    this.pointer = pointer; // 指针
  }
}


export { RuneId, Rune, Symbol,Edict,Terms, Etching,RunestoneParams};

