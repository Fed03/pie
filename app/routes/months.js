import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    // get current month from date
    // get the correct month
    // than redirect
    let month = 1;
    this.transitionTo('months.view', month);
  }
});
