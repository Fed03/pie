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
    findLatestInDb('configuration').then(config => {
      assert.ok(config, "A config object has been created");
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
  assert.expect(3);
  visit('/setup');
  fillIn('[name=username]', 'John Doe');
  fillIn('[name=initial-balance]', 12345);
  click('[type=submit]');

  andThen(() => {
    return findLatestInDb('wallet').then(wallet => {
      assert.equal(wallet.get('ownerName'), 'John Doe');
      assert.equal(wallet.get('value'), 12345);
      findLatestInDb('configuration').then(config => {
        assert.ok(config.get('installed'), 'Config is installed');
      });
    });
  });
});
