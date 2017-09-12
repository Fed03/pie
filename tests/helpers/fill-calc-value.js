import { click, findWithAssert } from "ember-native-dom-helpers";

const OpMapping = {
  "+": "sum",
  "-": "subtract",
  "*": "multiply",
  "/": "divide"
};

async function fillCalcValue(value, selector) {
  let calc;
  if (selector) {
    calc = findWithAssert(selector);
  } else {
    calc = findWithAssert("[data-test-calculator]");
  }

  let digits = value.split("");
  const op = /^(\+|-|\*|\/)\d+/.exec(value);
  if (op) {
    digits.shift();
    await click(`[data-test-calc-key="${OpMapping[op[1]]}"]`, calc);
  }

  digits.forEach(async digit => {
    if (digit === ".") {
      await click('[data-test-calc-key="dot"]', calc);
    } else {
      await click(`[data-test-calc-key="${parseInt(digit)}"]`, calc);
    }
  });
}

export { fillCalcValue };
