import Ember from 'ember';

export default Ember.Controller.extend({
  transactionCategory: Ember.computed('model.[]', {
    get() {
      return this.get('model').filterBy('type', 'outcome').get('firstObject');
    }
  }),
  transactionType: Ember.computed.readOnly('transactionCategory.type'),
  init() {
    this._super(...arguments);
    this.resetToDefaultProperties();
  },
  actions: {
    createTransaction() {
      return this._saveTransaction().then(() => {
        return this._updateWallet();
      }).then(() => {
        this.transitionToRoute('months');
      });
    }
  },
  resetToDefaultProperties() {
    this.setProperties({
      transactionValue: 0,
      transactionDescription: null,
      transactionDate: new Date()
    });
  },
  _updateWallet() {
    let wallet = this.store.peekAll('wallet').get('firstObject');
    wallet.incrementProperty('value', this._getValueWithSign());
    return wallet.save();
  },
  _saveTransaction() {
    return this._findBelongingMonth().then(month => {
      const category = this.get('transactionCategory');

      const newTransaction = this.store.createRecord('transaction', {
        value: this._getValueWithSign(),
        description: this.get('transactionDescription'),
        date: this._getDateWithoutTime(),
        category: category,
        month: month
      });

      month.get('transactions').pushObject(newTransaction);
      category.get('transactions').pushObject(newTransaction);

      return newTransaction.save().then(() => {
        return month.save();
      }).then(() => {
        return category.save();
      });
    });
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
