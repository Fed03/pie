import Ember from "ember";
import { filterBy, first, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Ember.Controller.extend({
  defaultCategory: first(sort(filterBy("model", raw("type"), raw("outcome")), ["name"])),
  transactionCategory: Ember.computed.oneWay("defaultCategory"),
  transactionType: Ember.computed.readOnly("transactionCategory.type"),
  transactionDate: new Date(),
  resetToDefaultProperties() {
    this.setProperties({
      transactionValue: 0,
      transactionDescription: null,
      transactionDate: new Date(),
      transactionCategory: this.get("defaultCategory")
    });
  }
});
