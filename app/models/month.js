import { computed } from '@ember/object';
import Model from "ember-pouch/model";
import DS from "ember-data";
import getDateForCurrentMonth from "../utils/get-date-for-current-month";

const {
  attr,
  hasMany
  // belongsTo
} = DS;

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export default Model.extend({
  date: attr("date", { defaultValue: getDateForCurrentMonth }),
  transactions: hasMany("transaction", { dontsave: true }),
  openingBalance: attr("number"),

  name: computed("date", {
    get() {
      return months[this.get("date").getMonth()];
    }
  }).readOnly(),

  balance: computed("transactions.@each.value", {
    get() {
      return this.get("transactions")
        .mapBy("value")
        .reduce((accumulator, value) => {
          return accumulator + value;
        }, 0);
    }
  })
});
