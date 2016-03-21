import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    // get current month from date
    // get the correct month
    // than redirect
    let post = 1;
    this.transitionTo('month', 1);
  }
});
