import Ember from 'ember';
import { formatMoney } from 'accounting';

const { computed } = Ember;

const typeClasses = {
  income: 'income-amount',
  outcome: 'outcome-amount'
};

export default Ember.Component.extend({
  value: 0,
  _value: computed.oneWay('value'),
  actions: {
    updateValue(newValue) {
      this.set('_value', newValue);
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
  formattedValue: computed('_value', 'typeClass', {
    get() {
      return formatMoney(this.get('_value'), {
        format: `${this.get('sign')}%v`,
      });
    }
  })
});
