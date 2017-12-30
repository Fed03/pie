import { computed } from "@ember/object";
import { inject } from "@ember/service";
import Controller from "@ember/controller";
import { groupBy, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Controller.extend({
  monthsService: inject(),
  currentBalance: computed("model.openingBalance", "model.balance", {
    get() {
      return this.get("model.openingBalance") + this.get("model.balance");
    }
  }),
  transactionsByDate: sort(
    groupBy("model.transactions", raw("date"), (groupDate, currentDate) => {
      return groupDate.getTime() == currentDate.getTime();
    }),
    ["value:desc"]
  ),

  actions: {
    async transitionToMonth(monthDate) {
      let month = await this.get("monthsService").findMonthByDate(monthDate);
      this.transitionToRoute("months.view", month);
    }
  }
});
