import Ember from 'ember';
import { formatMoney } from 'accounting';

const { computed } = Ember;

const typeClasses = {
  income: 'income-amount',
  outcome: 'outcome-amount'
};

export default Ember.Component.extend({
  calcOpened: false,
  value: 0,
  _value: Ember.computed.oneWay('value'),
  actions: {
    toggleCalc() {
      this.toggleProperty('calcOpened');
    },
    updateValue(result) {
      this.toggleProperty('calcOpened');
      this.set('_value', result);
      if (this.get('update')) {
        this.get('update')(result);
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
  formattedValue: computed('_value', 'sign', {
    get() {
      return formatMoney(this.get('_value'), {
        format: `${this.get('sign')}%v`,
      });
    }
  })
});
