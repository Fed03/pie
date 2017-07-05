import { click, findWithAssert } from "ember-native-dom-helpers";
import testSelector from "ember-test-selectors";

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
    calc = findWithAssert(testSelector("calculator"));
  }

  let digits = value.split("");
  const op = /^(\+|-|\*|\/)\d+/.exec(value);
  if (op) {
    digits.shift();
    await click(testSelector("calc-key", OpMapping[op[1]]), calc);
  }

  digits.forEach(async digit => {
    if (digit === ".") {
      await click(testSelector("calc-key", "dot"), calc);
    } else {
      await click(testSelector("calc-key", parseInt(digit)), calc);
    }
  });
}

export { fillCalcValue };
