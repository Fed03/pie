import Ember from "ember";

const TypeSignMap = {
  income: "+",
  outcome: "-"
};

export default Ember.Component.extend({
  "data-test-transaction-value-input": true,
  classNameBindings: ["inputFocused"],
  inputFocused: false,
  displayValue: Ember.computed("value", "transactionType", {
    get() {
      let { value, transactionType } = this.getProperties(
        "value",
        "transactionType"
      );
      let displayValue = Ember.isPresent(value) ? value : 0;
      return `${TypeSignMap[
        transactionType
      ]}${displayValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }
  }),
  actions: {
    toggleSelector() {
      this.toggleProperty("inputFocused");
    }
  }
});
