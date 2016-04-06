import { test } from 'qunit';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForPouchAcceptance('Acceptance | create transaction');

test('the selected category is the first in the outcome tests', function(assert) {
  createList('category', 2, {type: 'income'});
  create('category', {name:'foo', type: 'outcome'});
  createList('category', 2, {type: 'outcome'});

  visit('/transactions/create');

  andThen(function() {
    assert.equal(find('[data-test-selector=selected-category-name]').text(), 'foo');
  });
});
