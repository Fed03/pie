import Component from "@ember/component";
import momentComputed from "ember-moment/computeds/moment";
import format from "ember-moment/computeds/format";
import moment from "moment";

export default Component.extend({
  currentMonthDate: momentComputed("currentMonth.date"),
  currentMonthName: format("currentMonthDate", "MMMM YYYY"),

  actions: {
    prevMonth() {
      this.sendAction("prevMonthAction", this._prevDate(), this.get("currentMonth"));
    },
    nextMonth() {
      this.sendAction("nextMonthAction", this._nextDate(), this.get("currentMonth"));
    }
  },

  _prevDate() {
    return this._getPrevOrNextMonth("prev");
  },

  _nextDate() {
    return this._getPrevOrNextMonth("next");
  },

  _getPrevOrNextMonth(direction) {
    let month = this.get("currentMonthDate").clone();
    let duration = moment.duration(1, "months");
    switch (direction) {
      case "prev":
        month.subtract(duration);
        break;
      case "next":
        month.add(duration);
        break;
    }

    return month.toDate();
  }
});
