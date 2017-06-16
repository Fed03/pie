import Ember from "ember";
import layout from "../templates/components/calc-display";

export default Ember.Component.extend({
  layout,
  "data-test-calculator-display": true,
  classNames: ["calculator-display"],
  formattedValue: Ember.computed("value", {
    get() {
      let val = this.get("value");
      return val ? val.toLocaleString("en-US") : "0";
    }
  }).readOnly()
});
