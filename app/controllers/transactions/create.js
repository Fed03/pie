import { inject as service } from "@ember/service";
import { oneWay, readOnly } from "@ember/object/computed";
import Controller from "@ember/controller";
import { run } from "@ember/runloop";
import { filterBy, first, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Controller.extend({
  monthsService: service(),
  currentUser: service(),

  defaultCategory: first(sort(filterBy("model", raw("type"), raw("outcome")), ["name"])),
  transactionCategory: oneWay("defaultCategory"),
  transactionType: readOnly("transactionCategory.type"),
  transactionDate: new Date(),
  isCatSelectorShowing: false,

  resetToDefaultProperties() {
    this.setProperties({
      transactionValue: 0,
      transactionDescription: null,
      transactionDate: new Date(),
      transactionCategory: this.get("defaultCategory")
    });
  },

  _getValueWithSign() {
    let value = this.get("transactionValue");
    let type = this.get("transactionType");

    if (type === "outcome") {
      return value * -1;
    }

    return value;
  },

  _getDateWithoutTime() {
    const date = new Date(this.get("transactionDate").getTime());
    date.setHours(0, 0, 0, 0);
    return date;
  },

  _getBelongingMonth() {
    let date = this._getDateWithoutTime();
    return this.get("monthsService").findMonthByDate(date);
  },

  _updateUserCurrentBalance(transaction) {
    const value = transaction.get("value");
    return run(() => this.get("currentUser.user").updateCurrentBalanceByValue(value));
  },

  actions: {
    async createTransaction() {
      const month = await this._getBelongingMonth();

      const transaction = await run(() => {
        return this.store
          .createRecord("transaction", {
            value: this._getValueWithSign(),
            description: this.get("transactionDescription"),
            date: this._getDateWithoutTime(),
            category: this.get("transactionCategory"),
            month
          })
          .save();
      });

      await this._updateUserCurrentBalance(transaction);

      return this.transitionToRoute("months.view", month);
    },

    selectCategory(selectedCategory) {
      this.set("transactionCategory", selectedCategory);
      this.toggleProperty("isCatSelectorShowing");
    }
  }
});
