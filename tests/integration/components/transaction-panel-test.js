import { moduleForComponent, test } from 'ember-qunit';
import { make, manualSetup } from 'ember-data-factory-guy';
import moment from 'moment';
import hbs from 'htmlbars-inline-precompile';

const stringContains = function(string, containing) {
  containing = containing.split(' ').join('\\s+');
  return (new RegExp(containing)).test(string);
};

moduleForComponent('transaction-panel', 'Integration | Component | transaction panel', {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it renders with the correct attrs', function(assert) {
  const today = new Date();
  this.set('date', today);
  this.render(hbs`{{transaction-panel date=date}}`);

  assert.equal(this.$('div.transaction--panel.mui-panel').length, 1);
  assert.ok(this.$('div.transaction--panel.mui-panel').is(`[data-test-selector=${today.getUTCDate()}-day]`));
});

test('it renders the date', function(assert) {
  const today = new Date();
  this.set('date', today);
  this.render(hbs`{{transaction-panel date=date}}`);

  assert.ok(stringContains(this.$('.transaction--list-date').text(), moment().format('D dddd MMMM YYYY')));
});

test('it prints the sum of transactions', function(assert) {
  this.set('transactions', [
    make('transaction', {value: 5.20}),
    make('transaction', {value: -3.10}),
    make('transaction', {value: 0.40})
  ]);
  this.render(hbs`{{transaction-panel transactions=transactions}}`);

  assert.equal(this.$('.transaction--list-total-balance').text().trim(), "+2.50");
});
