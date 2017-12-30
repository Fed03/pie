import Component from "@ember/component";
import momentComputed from "ember-moment/computeds/moment";
import format from "ember-moment/computeds/format";

export default Component.extend({
  "data-test-month-selector": true,
  currentMonthDate: momentComputed("currentMonth.date"),
  currentMonthName: format("currentMonthDate", "MMMM YYYY"),
});
