import { test } from 'qunit';
// import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | show current month');

test('visiting `/` redirects to the current month', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/show-current-month');
  });
});
