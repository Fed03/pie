import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('configuration').then(configs => {
      let config = configs.get('firstObject');
      if (! config) {
        config = this.store.createRecord('configuration').save();
      }
      return config;
    });
  },
  afterModel(configurationModel) {
    if (configurationModel.get('installed')) {
      this.transitionTo('months');
    }
  }
});
