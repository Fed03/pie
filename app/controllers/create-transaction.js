import Ember from 'ember';

export default Ember.Controller.extend({
  transactionCategory: Ember.computed('model.[]', {
    get() {
      return this.get('model').filterBy('type', 'outcome').get('firstObject');
    }
  }),
  transactionValue: 0,
  transactionDate: new Date(),
  transactionType: Ember.computed.readOnly('transactionCategory.type'),
  actions: {
    createTransaction() {
      return this._findBelongingMonth().then(month => {

        const newTransaction = this.store.createRecord('transaction', {
          value: this._getValueWithSign(),
          description: this.get('transactionDescription'),
          date: this._getDateWithoutTime(),
          category: this.get('transactionCategory'),
          month: month
        });

        return newTransaction.save();
      });
    }
  },
  _getDateWithoutTime() {
    const date = new Date(this.get('transactionDate').getTime());
    date.setUTCHours(0,0,0,0);
    return date;
  },
  _getValueWithSign() {
    const value = this.get('transactionValue');
    return this.get('transactionType') === 'income' ? value : -value;
  },
  _findBelongingMonth() {
    const date = this._getDateWithoutTime();
    date.setUTCDate(1);
    return this.store.findAll('month').then(months => {
      return months.find(month => month.get('date').getTime() === date.getTime());
    });
  }
});
