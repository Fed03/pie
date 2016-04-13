import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('configuration').then(configs => {
      return configs.get('firstObject');
    });
  },
  afterModel(configModel) {
    if (! configModel) {
      return this.store.createRecord('configuration').save();
    }
  }
});
