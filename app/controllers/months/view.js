import Ember from 'ember';

export default Ember.Controller.extend({
  currentBalance: Ember.computed('model.openingBalance', 'model.balance', {
    get() {
      return this.get('model.openingBalance') + this.get('model.balance');
    }
  })
});
