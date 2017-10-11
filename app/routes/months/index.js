import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  monthsService: service(),

  async beforeModel() {
    let currentMonth = await this.get("monthsService").findCurrentMonth();
    this.transitionTo("months.view", currentMonth);
  }
});
