import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';
import getDateForCurrentMonth from '../utils/get-date-for-current-month';

const {
  attr,
  hasMany
} = DS;

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

export default Model.extend({
  date: attr('date', { defaultValue: getDateForCurrentMonth}),
  transactions: hasMany('transaction'),
  openingBalance: attr('number'),

  name: Ember.computed('date', {
    get() {
      return months[this.get('date').getUTCMonth()];
    }
  }),
  balance: Ember.computed('transactions.@each.value', {
    get() {
      return this.get('transactions').reduce((sum, transaction) => {
        return sum + transaction.get('value');
      }, 0);
    }
  })
});
