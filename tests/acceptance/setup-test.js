import { test } from 'qunit';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForAcceptance('Acceptance | setup', {
  beforeEach() {
    this.store = this.application.__container__.lookup('service:store');
  }
});

test('visiting / when no configuration is present redirects to setup page',
function(assert) {
  assert.expect(3);
  this.store.findAll('configuration').then(configs => {
    assert.deepEqual(configs.get('length'), 0, "Configuration does not exist");
  });
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/setup');
    this.store.findAll('configuration').then(configs => {
      assert.equal(configs.get('length'), 1, "A config object has been created");
    });
  });
});

test('if installed property is false redirects to setup', function(assert) {
  create('configuration', { installed: false });
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/setup');
  });
});

test('create wallet', function(assert) {
  visit('/setup');
  fillIn('[data-test-selector=username]', 'John Doe');
  fillIn('[data-test-selector=initial-balance]', 12345);
  click('[type=submit]');

  andThen(() => {
    this.store.findAll('wallet').then(wallets => {
      return wallets.get('firstObject');
    }).then(wallet => {
      assert.equal(wallet.get('ownerName'), 'John Doe');
      assert.equal(wallet.get('value'), 12345);
    });
  });
});
