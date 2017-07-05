import Ember from "ember";

const TypeSignMap = {
  income: "+",
  outcome: "-"
};

export default Ember.Component.extend({
  "data-test-transaction-value-input": true,
  classNameBindings: ["inputFocused", "transactionTypeClass"],
  transactionTypeClass: Ember.computed("transactionType", {
    get() {
      return `${this.get("transactionType")}-amount`;
    }
  }),
  inputFocused: false,
  modalOpened: Ember.computed.alias("inputFocused"),
  internalValue: Ember.computed.oneWay("value"),
  displayValue: Ember.computed("internalValue", "transactionType", {
    get() {
      let { internalValue: value, transactionType } = this.getProperties("internalValue", "transactionType");
      let displayValue = Ember.isPresent(value) ? value : 0;
      return `${TypeSignMap[transactionType]}${displayValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }
  }),
  actions: {
    toggleModal() {
      this.toggleProperty("modalOpened");
    },
    calc(result) {
      this.set("internalValue", result);
      this.send("toggleModal");
      this.sendAction("update", result);
    }
  }
});
