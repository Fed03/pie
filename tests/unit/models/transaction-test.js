import { moduleForModel, test } from 'ember-qunit';
import { manualSetup, make } from 'ember-data-factory-guy';

moduleForModel('transaction', 'Unit | Model | transaction', {
  // Specify the other units that are required for this test.
  needs: ['model:month', 'model:category'],
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it defaults the value of the date field to today', function(assert) {
  let expected = new Date();
  expected.setUTCHours(0, 0, 0, 0);

  let model = this.subject();

  assert.deepEqual(model.get('date'), expected, 'The date field of transaction is auto assigned');
});

test('it aliases the type field', function(assert) {
  const categoryType = 'income';
  let model = this.subject({ category: make('category', { type: categoryType }) });

  assert.equal(model.get('type'), categoryType, 'The type field reflects the category one');
});
