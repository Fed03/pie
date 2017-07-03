import { click, findWithAssert } from "ember-native-dom-helpers";
import testSelector from "ember-test-selectors";

async function fillCalcValue(value, selector) {
  let calc;
  if (selector) {
    calc = findWithAssert(selector);
  } else {
    calc = findWithAssert(testSelector("calculator"));
  }

  const digits = value.toString().split("");
  digits.forEach(async digit => {
    await click(testSelector("calc-key", parseInt(digit)), calc);
  });
}

export { fillCalcValue };
