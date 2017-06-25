import Ember from "ember";
import getDateForCurrentMonth from "pie/utils/get-date-for-current-month";

export default Ember.Route.extend({
  beforeModel() {
    const currentMonthDate = getDateForCurrentMonth();
    return this.store
      .queryRecord("month", {
        filter: {
          date: currentMonthDate
        }
      })
      .then(async month => {
        if (!month) {
          month = await this._createCurrentMonth();
        }
        this.transitionTo("months.view", month);
      });
  },

  _createCurrentMonth() {
    return this.store.createRecord("month").save();
  }
});
