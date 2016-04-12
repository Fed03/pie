import { test } from 'qunit';
import Ember from 'ember';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

function getCurrentMonthName() {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const today = new Date();

  return months[today.getUTCMonth()];
}

moduleForAcceptance('Acceptance | month view', {
  beforeEach() {
    this.store = this.application.__container__.lookup('service:store');
    return create('currentMonth').then(month => {
      this.currentMonth = month;
      return month;
    });
  }
});

test('visiting `/` redirects to the current month', function(assert) {
  visit('/');

  andThen(() => {
    assert.equal(currentRouteName(), 'months.view');
    assert.equal(currentURL(), `/months/${this.currentMonth.get('id')}`);
    assert.ok(
      find('.month-summary-header').text().trim().toLowerCase().indexOf(getCurrentMonthName()) !== -1,
      'The `.month-summary-header` contains the current month name'
    );
  });

});

test('viewing a month without transaction will result in an empty page', function(assert) {
  visit(`/months/${this.currentMonth.get('id')}`);

  andThen(function() {
    assert.ok(
      findWithAssert('.transactions-container').text().trim().split(' ').join(' '),
      "No transactions. Add (+) some!"
    );
    assert.equal(find('.transaction--list-item').length, 0);
  });
});

test('viewing a month will list its transactions', function(assert) {
  assert.expect(3);
  const todayDate = (new Date()).getUTCDate();
  return Ember.RSVP.all([
    createList('transaction', 2),
    create('transaction', 'yesterday'),
    create('transaction', 'yesterday'),
    create('transaction', 'yesterday')
  ]).then(() => {
    this.currentMonth.get('transactions').pushObjects(this.store.peekAll('transaction'));
    this.currentMonth.save().then(() => {
      visit(`/months/${this.currentMonth.get('id')}`);
      andThen(function() {
        assert.equal(find('.transaction--panel').length, 2, 'The month has 2 days with transactions');
        assert.equal(
          findWithAssert(`[data-test-selector=${todayDate}-day] .transaction--list-item`).length,
          2, 'Today panel has 2 transactions'
        );
        assert.equal(
          findWithAssert(`[data-test-selector=${todayDate - 1}-day] .transaction--list-item`).length,
          3, 'Yesterday panel has 3 transactions'
        );
      });
    });
  });
});

test('clicking on the add button redirects to create-transaction', function(assert) {
  assert.expect(1);
  visit(`/months/${this.currentMonth.get('id')}`);
  click('.create-transaction-link');

  andThen(function() {
    assert.equal(currentRouteName(), 'create-transaction');
  });
});

test('it computes the total balance', function(assert) {
  Ember.RSVP.all([
    create('transaction', {value: 5}),
    create('transaction', {value: -60}),
    createList('transaction', 3, {value: 10})
  ]).then(() => {
    this.currentMonth.get('transactions').pushObjects(this.store.peekAll('transaction'));
    this.currentMonth.set('openingBalance', 339);
    return this.currentMonth.save();
  });

  visit(`/months/${this.currentMonth.get('id')}`);
  andThen(() => {
    assert.equal(
      findWithAssert('[data-test-selector=opening-balance-value]').text().trim(),
      "€ 339.00", 'The opening balance is correctly displayed'
    );
    assert.equal(
      findWithAssert('[data-test-selector=month-balance-value]').text().trim(),
      "€ -25.00", 'The month balance is the sum of transactions value'
    );
    assert.equal(
      findWithAssert('[data-test-selector=current-balance-value]').text().trim(),
      "€ 314.00", 'The current balance'
    );
  });
});
