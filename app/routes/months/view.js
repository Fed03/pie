import Route from '@ember/routing/route';

export default Route.extend({
  model({ month_id }) {
    return this.store.findRecord("month", month_id);
  }
});
