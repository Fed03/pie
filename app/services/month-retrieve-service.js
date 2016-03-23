import Ember from 'ember';
import getDateForCurrentMonth from '../utils/get-date-for-current-month';

const {
  RSVP: {
    Promise
  }
} = Ember;

function createCurrentMonth(store) {
  let month = store.createRecord('month');

  return month.save();
}

export default Ember.Service.extend({
  store: Ember.inject.service(),

  findCurrentMonth() {
    return this.get('store').findAll('month').then(months => {
      const currentMonthDate = getDateForCurrentMonth();
      let month = months.find(item => {
        return item.get('date').getTime() === currentMonthDate.getTime();
      });

      if (month) {
        return Promise.resolve(month);
      }

      return createCurrentMonth(this.get('store'));
    });
  }
});
