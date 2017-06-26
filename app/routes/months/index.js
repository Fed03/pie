import Ember from "ember";
import getDateForCurrentMonth from "pie/utils/get-date-for-current-month";

export default Ember.Route.extend({
  // beforeModel() {
  //   const currentMonthDate = getDateForCurrentMonth();
  //   return this.store
  //     .queryRecord("month", {
  //       filter: {
  //         date: currentMonthDate
  //       }
  //     })
  //     .then(async month => {
  //       if (!month) {
  //         month = await this._createCurrentMonth();
  //       }
  //       this.transitionTo("months.view", month);
  //     });
  // },
  beforeModel() {
    const currentMonthDate = getDateForCurrentMonth();
    return this.store.findAll("month").then(async months => {
      let currentMonth = months.find(month => {
        return month.get("date").getTime() === currentMonthDate.getTime();
      });
      if (!currentMonth) {
        currentMonth = await this._createCurrentMonth();
      }
      this.transitionTo("months.view", currentMonth);
    });
  },

  _createCurrentMonth() {
    return this.store.createRecord("month").save();
  }
});
