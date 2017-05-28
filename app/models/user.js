import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

export default Model.extend({
  name: attr('string'),
  transactions: hasMany('transaction'),
  openingBalance: attr('number'),
  currentBalance: attr('number')
});
