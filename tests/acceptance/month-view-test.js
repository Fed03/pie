import { test } from 'qunit';
import { authenticateSession } from 'pie/tests/helpers/ember-simple-auth';
import moduleForAcceptance from 'pie/tests/helpers/module-for-pouch-acceptance';
// import { visit, click, find, findWithAssert } from 'ember-native-dom-helpers';

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
    // let monthPromise = create('currentMonth').then(month => {
    //   this.currentMonth = month;
    //   return month;
    // });
    // let configPromise = create('configuration', { installed:true });
    //
    // return Ember.RSVP.all([monthPromise, configPromise]);
  }
});

test('visiting `/` redirects to the current month', async function(assert) {
  authenticateSession(this.application);
  const currentMonth = await create('currentMonth');

  await visit('/');

  assert.equal(currentRouteName(), 'months.view');
  assert.equal(currentURL(), `/months/${currentMonth.get('id')}`);
  assert.ok(
    find('.month-summary-header').text().trim().toLowerCase().indexOf(getCurrentMonthName()) !== -1,
    'The `.month-summary-header` contains the current month name'
  );
});

test('viewing a month without transaction will result in an empty page', async function(assert) {
  authenticateSession(this.application);
  const currentMonth = await create('currentMonth');

  await visit(`/months/${currentMonth.get('id')}`);

  assert.ok(
    findWithAssert('.transactions-container').text().trim().split(' ').join(' '),
    "No transactions. Add (+) some!"
  );
  assert.equal(find('.transaction--list-item').length, 0);
});

test('viewing a month will list its transactions', async function(assert) {
  assert.expect(3);
  authenticateSession(this.application);
  const currentMonth = await create('currentMonth');
  const todayDate = (new Date()).getUTCDate();

  await createList('transaction', 2, {month: currentMonth});
  await create('transaction', 'yesterday', {month: currentMonth});
  await create('transaction', 'yesterday', {month: currentMonth});
  await create('transaction', 'yesterday', {month: currentMonth});

  currentMonth.get('transactions').pushObjects(this.store.peekAll('transaction'));
  await currentMonth.save();

  await visit(`/months/${currentMonth.get('id')}`);
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

test('clicking on the add button redirects to transaction.create', async function(assert) {
  assert.expect(1);
  authenticateSession(this.application);
  const currentMonth = await create('currentMonth');

  await visit(`/months/${currentMonth.get('id')}`);
  await click('.create-transaction-link');

  assert.equal(currentRouteName(), 'transactions.create');
});

test('it computes the total balance', async function(assert) {
  authenticateSession(this.application);
  const currentMonth = await create('currentMonth');

  await create('transaction', {value: 5, month: currentMonth});
  await create('transaction', {value: -60, month: currentMonth});
  await createList('transaction', 3, {value: 10, month: currentMonth});

  currentMonth.get('transactions').pushObjects(this.store.peekAll('transaction'));
  currentMonth.set('openingBalance', 339);
  await currentMonth.save();

  await visit(`/months/${currentMonth.get('id')}`);
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
