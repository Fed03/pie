import Ember from "ember";

export default Ember.Route.extend({
  model({ month_id }) {
    return this.store.findRecord("month", month_id);
  }
});
