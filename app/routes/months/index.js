import Ember from 'ember';

export default Ember.Route.extend({
  monthService: Ember.inject.service('month-retrieve-service'),

  beforeModel() {
    this.get('monthService').findCurrentMonth().then(month => {
      this.transitionTo('months.view', month);
    });
  }
});
