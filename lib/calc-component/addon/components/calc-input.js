import Ember from "ember";
import layout from "../templates/components/calc-input";

const CalcOperations = {
  sum(prevValue, currValue) {
    return prevValue + currValue;
  },
  subtract(prevValue, currValue) {
    return prevValue - currValue;
  },
  multiply(prevValue, currValue) {
    return prevValue * currValue;
  },
  divide(prevValue, currValue) {
    return prevValue / currValue;
  },
  equals(prevValue, currValue) {
    return currValue;
  }
};

export default Ember.Component.extend({
  layout,
  "data-test-calculator": true,
  classNames: ["calculator"],

  displayValue: "0",
  internalValue: 0,
  lastOperator: null,

  didReceiveAttrs() {
    const val = this.get("value");
    if (val) {
      this.set("displayValue", String(val));
      this.set("internalValue", val);
    }
  },

  actions: {
    inputDigit(digit) {
      const displayValue = this.get("displayValue");
      digit = String(digit);
      if (this.get("lastOperator")) {
        this.set("displayValue", digit);
      } else {
        this.set(
          "displayValue",
          displayValue === "0" ? digit : displayValue + digit
        );
      }
    },
    inputDot() {
      const displayValue = this.get("displayValue");
      if (!/\./.test(displayValue)) {
        this.set("displayValue", displayValue + ".");
      }
    },
    operation(operator) {
      const { internalValue, lastOperator, displayValue } = this.getProperties(
        "internalValue",
        "lastOperator",
        "displayValue"
      );
      const inputValue = parseFloat(displayValue);
      if (internalValue === 0) {
        this.set("internalValue", inputValue);
      } else {
        const newValue = CalcOperations[lastOperator](
          internalValue,
          inputValue
        );
        this.setProperties({
          internalValue: newValue,
          displayValue: String(newValue)
        });
      }
      this.set("lastOperator", operator);
    },
    clear() {
      const displayValue = this.get("displayValue");
      if (displayValue === "0") {
        this.setProperties({
          internalValue: 0,
          lastOperator: null
        });
      } else {
        this.set("displayValue", "0");
      }
    },
    toggleSign() {
      const currentValue = parseFloat(this.get("displayValue"));
      this.set("displayValue", String(currentValue * -1));
    }
  }
});
