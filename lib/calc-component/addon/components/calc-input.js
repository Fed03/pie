import Ember from "ember";
import layout from "../templates/components/calc-input";

export default Ember.Component.extend({
  layout,
  "data-test-calculator": true,
  classNames: ["calculator"],
  displayValue: "0",
  didReceiveAttrs() {
    const val = this.get("value");
    if (val) {
      this.set("displayValue", val);
    }
  },
  actions: {
    inputDigit(digit) {
      const displayValue = this.get("displayValue");
      digit = String(digit);
      this.set(
        "displayValue",
        displayValue === "0" ? digit : displayValue + digit
      );
    },
    inputDot() {
      const displayValue = this.get("displayValue");
      if (!/\./.test(displayValue)) {
        this.set("displayValue", displayValue + ".");
      }
    }
  }
});
