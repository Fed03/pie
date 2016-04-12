import { test } from 'qunit';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForAcceptance('Acceptance | wallet', {
  beforeEach() {
    this.store = this.application.__container__.lookup('service:store');
    return create('wallet', { value: 12345.67 }).then(wallet => {
      this.wallet = wallet;
      return wallet;
    });
  }
});

test('the wallet value is displayed on the appbar', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(
      findWithAssert('[data-test-selector="wallet-value"]').text().trim(),
      '€ 12,345.67'
    );
  });
});

test('if curentMonth does not exists, creates it and assign the wallet value as its opening balance',
function(assert) {
  assert.expect(5);
  this.store.findAll('month').then(months => {
    assert.equal(months.get('length'), 0, "Current month does not exist");
    visit('/');
    andThen(() => {
      assert.equal(currentRouteName(), 'months.view', 'It has redirected to the "months.view" route');
      assert.equal(
        findWithAssert('[data-test-selector=opening-balance-value]').text().trim(),
        "€ 12,345.67", 'The opening balance is equal to wallet value'
      );
      this.store.findAll('month').then(months => {
        assert.equal(months.get('length'), 1, "Current month exists");
        let currentMonth = months.get('firstObject');
        assert.ok(currentURL().indexOf(currentMonth.get('id')) !== -1, 'The url contains current month id');
      });
    });
  });
});
