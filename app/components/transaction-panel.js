import Ember from "ember";
import momentComputed from "ember-moment/computeds/moment";

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ["transaction--panel", "mui-panel"],
  "data-test-transaction-panel-for-day": computed("momentDate", {
    get() {
      return this.get("momentDate").date();
    }
  }),
  momentDate: momentComputed("date"),
  balance: computed("transactions.@each.value", {
    get() {
      return this.get("transactions").reduce((sum, transaction) => {
        return sum + transaction.get("value");
      }, 0);
    }
  }),
  balanceClass: computed("balance", {
    get() {
      const balance = this.get("balance");
      if (balance > 0) {
        return "income-amount";
      } else if (balance < 0) {
        return "outcome-amount";
      }
    }
  })
});
