import Ember from "ember";
import layout from "../templates/components/calc-input";

export default Ember.Component.extend({
  layout,
  "data-test-calculator": true,
  classNames: ["calculator"]
});
