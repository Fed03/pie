import { test } from 'qunit';
import moduleForPouchAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

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
  create('currentMonth', { id: 'foo' });
  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'months.view');
    assert.equal(currentURL(), '/months/foo');
    assert.ok(
      find('.month-summary-header').text().trim().toLowerCase().indexOf(getCurrentMonthName()) !== -1,
      'The `.month-summary-header` contains the current month name'
    );
  });

});
