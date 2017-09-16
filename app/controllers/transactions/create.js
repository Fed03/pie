import Ember from "ember";
import { filterBy, first, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

const { run, inject, computed } = Ember;

export default Ember.Controller.extend({
  monthsService: inject.service(),

  defaultCategory: first(sort(filterBy("model", raw("type"), raw("outcome")), ["name"])),

  transactionCategory: computed.oneWay("defaultCategory"),

  transactionType: computed.readOnly("transactionCategory.type"),

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

  actions: {
    async createTransaction() {
      const month = await this._getBelongingMonth();

      await run(() => {
        this.store
          .createRecord("transaction", {
            value: this._getValueWithSign(),
            description: this.get("transactionDescription"),
            date: this._getDateWithoutTime(),
            category: this.get("transactionCategory"),
            month
          })
          .save();
      });

      return this.transitionToRoute("months.view", month);
    },

    selectCategory(selectedCategory) {
      this.set("transactionCategory", selectedCategory);
      this.toggleProperty("isCatSelectorShowing");
    }
  }
});
