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

  name: Ember.computed('date', {
    get() {
      return months[this.get('date').getUTCMonth()];
    }
  })
});
