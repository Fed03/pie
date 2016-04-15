import Model from 'ember-pouch/model';
import DS from 'ember-data';
import Ember from 'ember';

const {
  attr,
  belongsTo
} = DS;

export default Model.extend({
  description: attr('string'),
  date: attr('date', { defaultValue: function() {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    return today;
  }}),
  value: attr('number'),
  type: Ember.computed.readOnly('category.type'),

  month: belongsTo('month'),
  category: belongsTo('category')
});
