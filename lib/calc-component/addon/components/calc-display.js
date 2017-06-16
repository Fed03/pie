import Ember from "ember";
import layout from "../templates/components/calc-display";

export default Ember.Component.extend({
  layout,
  "data-test-calculator-display": true
});
