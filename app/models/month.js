import Model from 'ember-pouch/model';
import DS from 'ember-data';
import getDateForCurrentMonth from '../utils/get-date-for-current-month';

const {
  attr,
  hasMany
} = DS;

export default Model.extend({
  date: attr('date', { defaultValue: getDateForCurrentMonth}),
  transactions: hasMany('transaction')
});
