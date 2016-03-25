import Ember from 'ember';
import OneWayInput from 'ember-one-way-controls/components/one-way-input';

const { computed } = Ember;

const typeClasses = {
  income: 'income-amount',
  outcome: 'outcome-amount'
};

export default OneWayInput.extend({
  type: 'number',
  classNameBindings: ['typeClass'],
  typeClass: computed('transactionType', {
    get() {
      return typeClasses[this.get('transactionType')];
    }
  })
});
