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
