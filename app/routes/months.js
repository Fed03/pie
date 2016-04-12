import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('wallet').then(wallets => wallets.get('firstObject'));
  },
  setupController(controller, model) {
    controller.set('wallet', model);
  }
});
