import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('configuration').then(configs => {
      return configs.get('firstObject');
    });
  },
  redirect(configModel) {
    if (!configModel) {
      this.transitionTo('setup');
    }
  }
});
