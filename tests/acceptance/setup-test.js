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
