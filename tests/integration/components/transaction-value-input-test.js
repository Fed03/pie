import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('transaction-value-input', 'Integration | Component | transaction value input', {
  integration: true
});

test('It renders a number input', function(assert) {
  this.render(hbs`{{transaction-value-input}}`);
  assert.equal(this.$('input[type="number"]').length, 1, 'Input is rendered');
});

test('it sets the correct class based on the transaction type', function(assert) {
  this.set('transactionType', 'income');

  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.ok(this.$('input').hasClass('income-amount'));
});
