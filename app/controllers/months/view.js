import Ember from "ember";
import { groupBy } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Ember.Controller.extend({
  currentBalance: Ember.computed("model.openingBalance", "model.balance", {
    get() {
      return this.get("model.openingBalance") + this.get("model.balance");
    }
  }),
  transactionsByDate: groupBy(
    "model.transactions",
    raw("date"),
    (groupDate, currentDate) => {
      return groupDate.getTime() == currentDate.getTime();
    }
  )
});
