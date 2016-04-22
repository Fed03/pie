import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { currency } from "accounting/settings";

moduleForComponent('transaction-value-input', 'Integration | Component | transaction value input', {
  integration: true,
  beforeEach() {
    currency.symbol = '€';
    currency.format = {
      pos: "%s +%v",
      neg: "%s -%v",
      zero: "%s %v"
    };
  }
});

test('It renders the element', function(assert) {
  this.render(hbs`{{transaction-value-input}}`);
  assert.equal(this.$('span[data-test-selector=transaction-value]').length, 1, 'The span element is rendered');
});

test('it sets the correct class based on the transaction type', function(assert) {
  this.set('transactionType', 'income');

  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.ok(this.$('[data-test-selector=transaction-value]').hasClass('income-amount'), "It has the 'income-amount' class");
  assert.notOk(this.$('[data-test-selector=transaction-value]').hasClass('outcome-amount'), "It has not the 'outcome-amount' class");

  this.set('transactionType', 'outcome');

  assert.ok(this.$('[data-test-selector=transaction-value]').hasClass('outcome-amount'), "It has the 'outcome-amount' class");
  assert.notOk(this.$('[data-test-selector=transaction-value]').hasClass('income-amount'), "It has not the 'income-amount' class");
});

test('it adds the sign according to transactionType', function(assert) {
  this.set('transactionType', 'income');
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.equal(this.$('[data-test-selector=transaction-value]').text().trim(), "+0.00", "It has the plus sign");

  this.set('transactionType', 'outcome');
  assert.equal(this.$('[data-test-selector=transaction-value]').text().trim(), "-0.00", "It has the minus sign");
});

test('it opens an overlay on click', function(assert) {
  this.render(hbs`{{transaction-value-input}}`);

  assert.equal(this.$('.overlay').length, 0, 'The overlay is hidden');
  this.$('[data-test-selector=transaction-value]').click();
  assert.equal(this.$('.overlay').length, 1, 'The overlay is visible');
});

test('it adds sign on calc', function(assert) {
  this.set('transactionType', 'income');
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
  this.$('[data-test-selector=transaction-value]').click();

  this.$('[data-number=1]').click();
  this.$('[data-number=2]').click();
  this.$('[data-number=3]').click();
  this.$('.calc-input--commit-btn').click();

  assert.equal(this.$('[data-test-selector=transaction-value]').text().trim(), "+123.00");
});

test('it closes the overlay on calc', function(assert) {
  this.set('transactionType', 'income');
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
  this.$('[data-test-selector=transaction-value]').click();

  assert.equal(this.$('.overlay').length, 1, 'The overlay is visible');

  this.$('[data-number=1]').click();
  this.$('[data-number=2]').click();
  this.$('[data-number=3]').click();
  this.$('.calc-input--commit-btn').click();

  assert.equal(this.$('.overlay').length, 0, 'The overlay is hidden');
});

test('changing value updates the val', function(assert) {
  this.set('transactionType', 'income');
  this.set('value', 123456.78);
  this.render(hbs`{{transaction-value-input transactionType=transactionType value=value}}`);

  assert.equal(this.$('[data-test-selector=transaction-value]').text().trim(), "+123,456.78");

  this.set('value', 23.45);
  assert.equal(this.$('[data-test-selector=transaction-value]').text().trim(), "+23.45");
});

test('it trigger an action', function(assert) {
  assert.expect(2);

  let expected = -30;
  this.set('transactionType', 'outcome');
  this.set('value', 10);
  this.on('update', function(newVal) {
    assert.equal(newVal, expected, 'The action fired');
  });

  this.render(hbs`
    {{transaction-value-input
    transactionType=transactionType
    value=value
    update=(action 'update')
    }}`
  );

  this.$('[data-test-selector=transaction-value]').click();
  this.$('[data-op=minus]').click();
  this.$('[data-number=4]').click();
  this.$('[data-number=0]').click();
  this.$('.calc-input--commit-btn').click();
  this.$('.calc-input--commit-btn').click();

  assert.notEqual(this.get('value'), expected, 'The initial value was not changed');
});
