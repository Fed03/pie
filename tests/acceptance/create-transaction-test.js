import { test } from 'qunit';
import moment from 'moment';
import Ember from 'ember';
import getDateForCurrentMonth from 'offline-app/utils/get-date-for-current-month';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForPouchAcceptance('Acceptance | create transaction', {
  beforeEach() {
    return Ember.RSVP.all([
      create('currentMonth'),
      create('configuration', { installed: true })
    ]);
  }
});

test('the selected category is the first in the outcome set', function(assert) {
  createList('category', 2, {type: 'income'});
  create('category', {name:'foo', type: 'outcome'});
  createList('category', 2, {type: 'outcome'});

  visit('/transactions/create');

  andThen(function() {
    assert.equal(find('[data-test-selector=selected-category-name]').text(), 'foo');
  });
});

test('the fields are prefilled with default values', function(assert) {
  const today = moment().format('D/M/YYYY');
  visit('/transactions/create');

  andThen(function() {
    assert.ok(find('[data-test-selector=transaction-value]').text().trim().indexOf("0.00") !== -1, 'Transaction value field is prefilled with 0');
    assert.notOk(find('[name="transaction-description"]').val(), 'Transaction desc field is empty');
    assert.equal(find('[name="transaction-date"]').val(), today, 'Transaction date field is prefilled with today date');
  });
});

test('it change the value field class according to the category type', function(assert) {
  create('category', {name:'foo', type: 'outcome', id: 1});
  create('category', {name:'bar', type: 'income', id: 2});
  visit('/transactions/create');

  click('li[data-category=1-foo]');
  andThen(function() {
    assert.ok(
      find('[data-test-selector=transaction-value]').hasClass('outcome-amount'),
      'Transaction value field has outcome-amount class'
    );
    assert.notOk(
      find('[data-test-selector=transaction-value]').hasClass('income-amount'),
      'Transaction value field has not income-amount class'
    );

    click('li[data-category=2-bar]');
    andThen(function() {
      assert.ok(
        find('[data-test-selector=transaction-value]').hasClass('income-amount'),
        'Transaction value field has income-amount class'
      );
      assert.notOk(
        find('[data-test-selector=transaction-value]').hasClass('outcome-amount'),
        'Transaction value field has not outcome-amount class'
      );
    });
  });
});

test('create transaction', function(assert) {
  assert.expect(8);
  const today = new Date();
  today.setUTCHours(0,0,0,0);

  create('category', {name:'foo', type: 'outcome'});
  visit('/transactions/create');

  andThen(() => {
    fillTransactionValue(25);
    fillIn('[name="transaction-description"]', 'An awesome book');
    click('.list-item[data-category$="-foo"]');
    click('[data-test-selector=submit-transaction]');
    andThen(() => {
      assert.equal(currentRouteName(), 'months.view');
      assert.ok(find('.transaction--list-item-description').text().indexOf('An awesome book') !== -1);
      findLatestInDb('transaction').then(transaction => {
        assert.equal(transaction.get('value'), -25, 'The value is -25');
        assert.equal(transaction.get('description'), 'An awesome book', 'The desc is "An awesome book"');
        assert.equal(transaction.get('date').getTime(), today.getTime(), 'The transaction date is today without hours');
        transaction.get('category').then(category => {
          assert.equal(category.get('name'), 'foo', 'The transaction category name is "foo"');
        });
        transaction.get('month').then(month => {
          assert.equal(month.get('date').getTime(), getDateForCurrentMonth().getTime(), 'The transaction month is correct');
          assert.equal(month.get('transactions.length'), 1, 'It has the transaction');
        });
      });
    });
  });
});

test('Sign is added to the value field', function(assert) {
  create('category', {name:'foo', type: 'outcome'});
  create('category', {name:'bar', type: 'income'});
  visit('/transactions/create');

  andThen(() => {
    assert.equal(find('[data-test-selector=transaction-value]').text().trim(), "-0.00", 'The value is set negative');
    click('.list-item[data-category$="-bar"]');
    andThen(() => {
      assert.equal(find('[data-test-selector=transaction-value]').text().trim(), "+0.00", 'The value is set positive');
      fillTransactionValue(12345);
      andThen(() => {
        assert.equal(find('[data-test-selector=transaction-value]').text().trim(), "+12,345.00", 'The value is formatted');
      });
    });
  });
});
