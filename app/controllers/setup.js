import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createWallet() {
      this.store.createRecord('wallet', {
        ownerName: this.get('username'),
        value: this.get('initialBalance')
      }).save();

      let config = this.get('model');
      config.set('installed', true);
      config.save();
    }
  }
});
