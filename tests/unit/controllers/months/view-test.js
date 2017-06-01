import { moduleFor, test } from 'ember-qunit';
import { makeNew, manualSetup } from 'ember-data-factory-guy';

moduleFor('controller:months/view', 'Unit | Controller | months.view', {
  // Specify the other units that are required for this test.
  needs: ['model:transaction', 'model:month'],
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it computes transactions balance', function(assert) {
  const trns1 = makeNew('transaction', { value: 60 });
  const trns2 = makeNew('transaction', { value: -31.25 });
  const month = makeNew('month', { transactions: [trns1, trns2], openingBalance: 100})
  let controller = this.subject({ model: month });

  assert.equal(
    controller.get('currentBalance'),
    128.75,
    'currentBalance is the sum of transactions value'
  );
});
