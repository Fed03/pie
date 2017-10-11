import { isPresent } from '@ember/utils';
import { alias, oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

const TypeSignMap = {
  income: "+",
  outcome: "-"
};

export default Component.extend({
  "data-test-transaction-value-input": true,
  classNameBindings: ["focused", "transactionTypeClass"],
  transactionTypeClass: computed("transactionType", {
    get() {
      return `${this.get("transactionType")}-amount`;
    }
  }),
  focused: false,
  modalOpened: alias("focused"),
  internalValue: oneWay("value"),
  displayValue: computed("internalValue", "transactionType", {
    get() {
      let { internalValue: value, transactionType } = this.getProperties("internalValue", "transactionType");
      let displayValue = isPresent(value) ? value : 0;
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
