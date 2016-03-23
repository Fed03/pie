import { moduleForModel, test } from 'ember-qunit';

moduleForModel('month', 'Unit | Model | month', {
  // Specify the other units that are required for this test.
  needs: ['model:transaction']
});

test('it defaults the value of the date filed to the current month', function(assert) {
  let expected = new Date();
  expected.setUTCDate(1);
  expected.setUTCHours(0, 0, 0, 0);

  let model = this.subject();

  assert.deepEqual(model.get('date'), expected, 'The date field of month is auto assigned');
});
