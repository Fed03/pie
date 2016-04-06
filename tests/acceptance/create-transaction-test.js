import { test } from 'qunit';
import moment from 'moment';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForPouchAcceptance('Acceptance | create transaction');

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
  let today = moment().format('D/M/YYYY');
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
