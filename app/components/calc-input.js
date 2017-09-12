import Ember from "ember";
import { EKMixin, keyDown, getCode } from "ember-keyboard";

// TODO: must be refactored entirely

const OpKeysMapping = {
  add: "sum",
  subtract: "subtract",
  multiply: "multiply",
  divide: "divide",
  enter: "equals"
};

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
  "data-test-calculator": true,
  classNames: ["calculator"],

  displayValue: "0",
  internalValue: 0,
  lastOperator: null,
  waitingForOperand: false,

  init() {
    this._super(...arguments);
    this.set("keyboardActivated", true);
  },

  didReceiveAttrs() {
    const val = this.get("value");
    if (val) {
      this.set("displayValue", String(val));
    }
  },

  inputDigitKey: Ember.on(keyDown(), function(event) {
    const match = /^((Numpad)|(Digit))(\d)$/.exec(getCode(event));
    if (match) {
      const digit = match[4];
      this.send("inputDigit", digit);
    }
  }),

  deleteLastDigitKey: Ember.on(keyDown("Backspace"), function() {
    this.send("deleteLastDigit");
  }),

  clearKey: Ember.on(keyDown("Delete"), function() {
    this.set("displayValue", "0");
    this.send("clear");
  }),

  dotKey: Ember.on(keyDown("NumpadDecimal"), function() {
    this.send("inputDot");
  }),

  opKey: Ember.on(keyDown(), function(event) {
    const match = /^Numpad((Add)|(Subtract)|(Multiply)|(Divide))$/.exec(getCode(event));
    if (match) {
      const op = OpKeysMapping[match[1].toLowerCase()];
      this.send("operation", op);
    }
  }),

  equalsKey: Ember.on(keyDown(), function(event) {
    const match = /^Numpad((Enter)|(Equal))$/.exec(getCode(event));
    if (match) {
      this.send("equals");
    }
  }),

  performOperation(operator) {
    const { internalValue, lastOperator, displayValue } = this.getProperties("internalValue", "lastOperator", "displayValue");
    let inputValue = parseFloat(displayValue);
    if (internalValue === 0) {
      this.set("internalValue", inputValue);
    } else {
      inputValue = CalcOperations[lastOperator](internalValue, inputValue);
      this.setProperties({
        internalValue: inputValue,
        displayValue: String(inputValue)
      });
    }
    this.setProperties({
      lastOperator: operator,
      waitingForOperand: true
    });

    return inputValue;
  },

  actions: {
    inputDigit(digit) {
      const displayValue = this.get("displayValue");
      digit = String(digit);
      if (this.get("waitingForOperand")) {
        this.setProperties({
          displayValue: digit,
          waitingForOperand: false
        });
      } else {
        this.set("displayValue", displayValue === "0" ? digit : displayValue + digit);
      }
    },
    inputDot() {
      const displayValue = this.get("displayValue");
      if (!/\./.test(displayValue)) {
        this.set("displayValue", displayValue + ".");
      }
    },
    operation(operator) {
      this.performOperation(operator);
    },
    equals() {
      let value = this.performOperation("equals");
      this.sendAction("onEquals", value);
    },
    clear() {
      const displayValue = this.get("displayValue");
      if (displayValue === "0") {
        this.setProperties({
          internalValue: 0,
          lastOperator: null,
          waitingForOperand: false
        });
      } else {
        this.set("displayValue", "0");
      }
    },
    toggleSign() {
      const currentValue = parseFloat(this.get("displayValue"));
      this.set("displayValue", String(currentValue * -1));
    },
    deleteLastDigit() {
      this.set("displayValue", this.get("displayValue").slice(0, -1));
    }
  }
});
