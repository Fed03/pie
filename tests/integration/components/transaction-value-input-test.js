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

test('It renders a number input', function(assert) {
  this.render(hbs`{{transaction-value-input}}`);
  assert.equal(this.$('input').length, 1, 'An input is rendered');
});

test('it sets the correct class based on the transaction type', function(assert) {
  this.set('transactionType', 'income');

  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.ok(this.$('input').hasClass('income-amount'), "It has the 'income-amount' class");
  assert.notOk(this.$('input').hasClass('outcome-amount'), "It has not the 'outcome-amount' class");

  this.set('transactionType', 'outcome');

  assert.ok(this.$('input').hasClass('outcome-amount'), "It has the 'outcome-amount' class");
  assert.notOk(this.$('input').hasClass('income-amount'), "It has not the 'income-amount' class");
});

test('it adds the sign according to transactionType', function(assert) {
  this.set('transactionType', 'income');
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.equal(this.$('input').val(), "+0.00", "It has the plus sign");

  this.set('transactionType', 'outcome');
  assert.equal(this.$('input').val(), "-0.00", "It has the minus sign");
});

test('it adds sign on typing', function(assert) {
  this.set('transactionType', 'income');
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  this.$('input').val('12345.67').trigger('input');
  assert.equal(this.$('input').val(), "+12,345.67");

  this.set('transactionType', 'outcome');
  assert.equal(this.$('input').val(), "-12,345.67");
});

test('changing value updates the val', function(assert) {
  this.set('transactionType', 'income');
  this.set('value', 123456.78);
  this.render(hbs`{{transaction-value-input transactionType=transactionType value=value}}`);

  assert.equal(this.$('input').val(), "+123,456.78");

  this.set('value', 23.45);
  assert.equal(this.$('input').val(), "+23.45");
});

test('it trigger an action', function(assert) {
  assert.expect(2);

  const expected = -30;
  this.set('transactionType', 'outcome');
  this.set('value', 10);
  this.on('update', function(newVal) {
    assert.equal(newVal, expected);
  });

  this.render(hbs`
    {{transaction-value-input
    transactionType=transactionType
    value=value
    update=(action 'update')
    }}`
  );

  this.$('input').val(expected).trigger('input');
  assert.notEqual(this.get('value'), expected);
});
