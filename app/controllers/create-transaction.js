import Ember from 'ember';

export default Ember.Controller.extend({
  transactionCategory: Ember.computed('model.[]', {
    get() {
      return this.get('model').filterBy('type', 'outcome').get('firstObject');
    }
  }),
  transactionValue: 0,
  transactionDate: new Date(),
  transactionTypeClass: Ember.computed('transactionCategory', {
    get() {
      return `${this.get('transactionCategory.type')}-amount`;
    }
  }),
  actions: {
    createTransaction() {
      const newTransaction = this.store.createRecord('transaction', {
        value: this.get('transactionValue'),
        description: this.get('transactionDescription'),
        date: this.get('transactionDate'),
        category: this.get('transactionCategory')
      });

      return newTransaction.save();
    }
  }
});
