import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createWallet() {
      return Ember.RSVP.all([
        this._createWallet(),
        this._markAsInstalled(),
        this._createBaseCategories(),
      ]).then(() => {
        this.transitionToRoute('months');
      });
    }
  },
  _createWallet() {
    return this.store.createRecord('wallet', {
      ownerName: this.get('username'),
      value: this.get('initialBalance')
    }).save();
  },
  _markAsInstalled() {
    return this.store.createRecord('configuration', {
      installed: true
    }).save();
  },
  _createBaseCategories() {
    const categoriesMap = [
      {
        name: 'Food',
        type: 'outcome'
      },
      {
        name: 'Sport',
        type: 'outcome'
      },
      {
        name: 'Family',
        type: 'outcome'
      },
      {
        name: 'Purchase',
        type: 'outcome'
      },
      {
        name: 'Clothes',
        type: 'outcome'
      },
      {
        name: 'Travel',
        type: 'outcome'
      },
      {
        name: 'Other',
        type: 'outcome'
      },
      {
        name: 'Sale',
        type: 'income'
      },
      {
        name: 'Present',
        type: 'income'
      },
    ];
    const categoryRecords = [];
    categoriesMap.forEach(properties => {
      categoryRecords.pushObject(this.store.createRecord('category', properties));
    });

    return Ember.RSVP.all(categoryRecords.map(record => record.save()));
  }
});
