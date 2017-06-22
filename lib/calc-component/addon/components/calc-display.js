import Ember from "ember";
import layout from "../templates/components/calc-display";

export default Ember.Component.extend({
  layout,
  "data-test-calculator-display": true,
  classNames: ["calculator-display"],
  formattedValue: Ember.computed("value", {
    get() {
      let value = Ember.isPresent(this.get("value")) ? this.get("value") : "0";
      let formattedValue = parseFloat(value).toLocaleString("en-US");

      const match = value.match(/\.\d*?(0*)$/);
      if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

      return formattedValue;
    }
  }).readOnly()
});
