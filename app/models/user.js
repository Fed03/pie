import Model from "ember-pouch/model";
import DS from "ember-data";

const { attr, hasMany } = DS;

export default Model.extend({
  name: attr("string"),
  transactions: hasMany("transaction"),
  initialBalance: attr("number"),
  currentBalance: attr("number"),

  updateCurrentBalanceByValue(value) {
    const updatedBalance = this.get("currentBalance") + Number(value);
    this.set("currentBalance", updatedBalance);
    return this.save();
  }
});
