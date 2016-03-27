import { test } from 'qunit';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';
// import moduleForAcceptance from 'offline-app/tests/helpers/module-for-acceptance';

function getCurrentMonthName() {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const today = new Date();

  return months[today.getUTCMonth()];
}

moduleForPouchAcceptance('Acceptance | show current month');

test('visiting `/` redirects to the current month', function(assert) {
  const monthName = getCurrentMonthName();

  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'months.view');
    assert.ok(
      find('.month-summary-header').text().trim().toLowerCase().indexOf(monthName) !== -1,
      'The `.month-summary-header` contains the current month name'
    );
  });
});
