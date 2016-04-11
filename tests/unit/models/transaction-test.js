import { moduleForModel, test } from 'ember-qunit';

moduleForModel('transaction', 'Unit | Model | transaction', {
  // Specify the other units that are required for this test.
  needs: ['model:month', 'model:category']
});

test('it defaults the value of the date field to today', function(assert) {
  let expected = new Date();
  expected.setUTCHours(0, 0, 0, 0);

  let model = this.subject();

  assert.deepEqual(model.get('date'), expected, 'The date field of transaction is auto assigned');
});
