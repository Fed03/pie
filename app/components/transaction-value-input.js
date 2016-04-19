import Ember from 'ember';
import { formatMoney } from 'accounting';

const { computed } = Ember;

const typeClasses = {
  income: 'income-amount',
  outcome: 'outcome-amount'
};

export default Ember.Component.extend({
  value: 0,
  actions: {
    updateValue(newValue) {
      this.set('value', newValue);
      if (this.get('update')) {
        this.get('update')(newValue);
      }
    }
  },
  sign: computed('transactionType', {
    get() {
      if (this.get('transactionType') === 'income') {
        return "+";
      } else if(this.get('transactionType') === 'outcome') {
        return "-";
      }
    }
  }),
  typeClass: computed('transactionType', {
    get() {
      return typeClasses[this.get('transactionType')];
    }
  }),
  formattedValue: computed('value', 'sign', {
    get() {
      return formatMoney(this.get('value'), {
        format: `${this.get('sign')}%v`,
      });
    }
  })
});
