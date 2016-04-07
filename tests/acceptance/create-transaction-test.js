import { test } from 'qunit';
import moment from 'moment';
import getDateForCurrentMonth from 'offline-app/utils/get-date-for-current-month';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForPouchAcceptance('Acceptance | create transaction', {
  beforeEach() {
    const store = this.application.__container__.lookup('service:store');
    return store.createRecord('month').save();
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
    assert.deepEqual(find('[name="transaction-value"]').val(), "0", 'Transaction value field is prefilled with 0');
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
      find('[name="transaction-value"]').hasClass('outcome-amount'),
      'Transaction value field has outcome-amount class'
    );
    assert.notOk(
      find('[name="transaction-value"]').hasClass('income-amount'),
      'Transaction value field has not income-amount class'
    );

    click('li[data-category=2-bar]');
    andThen(function() {
      assert.ok(
        find('[name="transaction-value"]').hasClass('income-amount'),
        'Transaction value field has income-amount class'
      );
      assert.notOk(
        find('[name="transaction-value"]').hasClass('outcome-amount'),
        'Transaction value field has not outcome-amount class'
      );
    });
  });
});

test('create category', function(assert) {
  assert.expect(5);
  const today = new Date();
  today.setUTCHours(0,0,0,0);

  create('category', {name:'foo', type: 'outcome'});
  visit('/transactions/create');

  andThen(() => {
    fillIn('[name="transaction-value"]', 25);
    fillIn('[name="transaction-description"]', 'An awesome book');
    click('.list-item[data-category$="-foo"]');
    click('[data-test-selector=submit-transaction]');
    andThen(() => {
      findLatestInDb('transaction').then(transaction => {
        assert.equal(transaction.get('value'), 25, 'The value is 25');
        assert.equal(transaction.get('description'), 'An awesome book', 'The desc is "An awesome book"');
        assert.equal(transaction.get('date').getTime(), today.getTime(), 'The transaction date is today without hours');
        transaction.get('category').then(category => {
          assert.equal(category.get('name'), 'foo', 'The transaction category name is "foo"');
        });
        transaction.get('month').then(month => {
          assert.equal(month.get('date').getTime(), getDateForCurrentMonth().getTime(), 'The transaction month is correct');
        });
      });
    });
  });
});
