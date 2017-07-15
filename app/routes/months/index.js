import Ember from "ember";

export default Ember.Route.extend({
  monthsService: Ember.inject.service(),

  async beforeModel() {
    let currentMonth = await this.get("monthsService").findCurrentMonth();
    this.transitionTo("months.view", currentMonth);
  }
});
