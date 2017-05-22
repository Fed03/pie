import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('configuration').then(configs => {
      return configs.get('firstObject');
    });
  },
  afterModel(configurationModel) {
    if (configurationModel && configurationModel.get('installed')) {
      this.transitionTo('months');
    }
  }
});
