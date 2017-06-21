import Ember from "ember";
import layout from "../templates/components/calc-input";
import { EKMixin, keyDown } from "ember-keyboard";

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

export default Ember.Component.extend(EKMixin, {
  layout,
  "data-test-calculator": true,
  classNames: ["calculator"],

  displayValue: "0",
  internalValue: 0,
  lastOperator: null,

  init() {
    this._super(...arguments);
    this.set("keyboardActivated", true);
  },

  didReceiveAttrs() {
    const val = this.get("value");
    if (val) {
      this.set("displayValue", String(val));
      this.set("internalValue", val);
    }
  },

  inputDigit: Ember.on(keyDown("Digit1"), keyDown("Numpad1"), () => {
    debugger;
  }),

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
        this.set("lastOperator", operator);
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
    },
    delete() {
      this.set("displayValue", this.get("displayValue").slice(0, -1));
    }
  }
});
