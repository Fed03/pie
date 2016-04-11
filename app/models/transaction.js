import Model from 'ember-pouch/model';
import DS from 'ember-data';

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

  month: belongsTo('month'),
  category: belongsTo('category')
});
