import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  transactionsByDate: groupBy('model.transactions', 'date', function(previusDate, currentDate) {
    return previusDate.getTime() === currentDate.getTime();
  })
});
