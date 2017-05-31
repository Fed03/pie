import Ember from 'ember';
import getDateForCurrentMonth from 'pie/utils/get-date-for-current-month';

export default Ember.Route.extend({
  beforeModel() {
    const currentMonthDate = getDateForCurrentMonth();
    return this.store.queryRecord('month', {
      filter: {
        date: currentMonthDate
      }
    }).then(month => {
      this.transitionTo('months.view', month);
    });
  }
});
