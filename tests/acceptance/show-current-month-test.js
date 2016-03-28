import { test } from 'qunit';
import { destroyPouchDB } from 'offline-app/tests/helpers/pouch-helpers';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-acceptance';

function getCurrentMonthName() {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const today = new Date();

  return months[today.getUTCMonth()];
}

moduleForAcceptance('Acceptance | show current month', {
  beforeEach() {
    return destroyPouchDB(this.application);
  }
});

test('visiting `/` redirects to the current month', function(assert) {
  const monthName = getCurrentMonthName();
  makeModel('month', {id: 'foo-bar'});

  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'months.view');
    assert.equal(currentURL(), `/months/foo-bar`);
    assert.ok(
      find('.month-summary-header').text().trim().toLowerCase().indexOf(monthName) !== -1,
      'The `.month-summary-header` contains the current month name'
    );
  });
});
