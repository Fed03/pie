import Model from "ember-pouch/model";
import DS from "ember-data";
import Ember from "ember";
import getDateForCurrentMonth from "../utils/get-date-for-current-month";

const {
  attr,
  hasMany
  // belongsTo
} = DS;

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export default Model.extend({
  date: attr("date", { defaultValue: getDateForCurrentMonth }),
  transactions: hasMany("transaction"),
  openingBalance: attr("number"),

  name: Ember.computed("date", {
    get() {
      return months[this.get("date").getUTCMonth()];
    }
  }).readOnly(),

  balance: Ember.computed("transactions.@each.value", {
    get() {
      return this.get("transactions").mapBy("value").reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
    }
  })
});
