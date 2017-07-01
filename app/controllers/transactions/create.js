import Ember from "ember";
import { filterBy, first, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Ember.Controller.extend({
  transactionCategory: first(sort(filterBy("model", raw("type"), raw("outcome")), ["name"])),
  transactionType: Ember.computed.readOnly("transactionCategory.type"),
  transactionDate: new Date()
});
