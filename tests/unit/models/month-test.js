import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
import { makeNew, manualSetup }  from 'ember-data-factory-guy';

moduleForModel('month', 'Unit | Model | month', {
  // Specify the other units that are required for this test.
  needs: ['model:transaction'],
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it defaults the value of the date field to the current month', function(assert) {
  let expected = new Date();
  expected.setUTCDate(1);
  expected.setUTCHours(0, 0, 0, 0);

  let model = this.subject();

  assert.deepEqual(model.get('date'), expected, 'The date field of month is auto assigned');
});

test('it computes the month name', function(assert) {
  let jan = new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 0));
  let model = this.subject({ date: jan });

  assert.equal(model.get('name'), 'january', 'The name field is automatically computed');
});

test('name attr is read only', function(assert) {
  let jan = new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 0));
  let model = this.subject({ date: jan });

  assert.throws(() => {
    model.set('name', 'foo');
  }, 'Setting name property raises exception');
});

test('it computes month balance', function(assert) {
  const transactions = Ember.A([
    makeNew('transaction', { value: 20.93 }),
    makeNew('transaction', { value: 21.00 }),
    makeNew('transaction', { value: -30.33 })
  ]);

  let model = this.subject({ transactions });

  assert.equal(model.get('balance').toFixed(2), 11.60, 'The balance equal the sum of transactions')
});
