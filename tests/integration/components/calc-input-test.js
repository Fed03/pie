import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { currency } from "accounting/settings";

moduleForComponent('calc-input', 'Integration | Component | calc input', {
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

test('it renders', function(assert) {
  this.render(hbs`{{calc-input}}`);

  assert.equal(this.$('.calc-input').length, 1, 'It has the correct class');
  assert.equal(this.$('.calc-input--playground').length, 1, 'It contains a playground');
  assert.equal(this.$('button.calc-input--number-btn').length, 10, 'It renders the buttons for the number');
  assert.equal(this.$('button.calc-input--op-btn').length, 4, 'It renders the op buttons');
  assert.equal(this.$('button.calc-input--reset-btn').length, 1, 'It renders the reset button');
  assert.equal(this.$('button.calc-input--del-btn').length, 1, 'It renders the del button');
  assert.equal(this.$('button.calc-input--commit-btn').length, 1, 'It renders the commit button');
});

test('the default value is 0 with symbol', function(assert) {
  this.render(hbs`{{calc-input}}`);

  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 0`, 'The default is 0');
});

test('it set an initial value', function(assert) {
  this.render(hbs`{{calc-input value=35}}`);

  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 35`);
});

test('it changes the playground on button press', function(assert) {
  this.render(hbs`{{calc-input}}`);

  this.$('button[data-number=9]').click();
  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 9`);

  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=7]').click();
  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 9 + 87`);
});

test('it displays the correct result', function(assert) {
  this.render(hbs`{{calc-input}}`);

  // we build "9 + 88 / 2"
  this.$('button[data-number=9]').click();
  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-op=divide]').click();
  this.$('button[data-number=2]').click();

  this.$('.calc-input--commit-btn').click();

  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 53`);
});

test('it fires an action if there are no operation involved', function(assert) {
  assert.expect(1);
  this.on('result', function(result) {
    assert.equal(result, 9);
  });
  this.render(hbs`{{calc-input onResult=(action 'result')}}`);

  this.$('button[data-number=9]').click();
  this.$('.calc-input--commit-btn').click();
});

test('it fires an action after clicking twice on commit if there are op', function(assert) {
  assert.expect(1);
  this.on('result', function(result) {
    assert.equal(result, 53);
  });
  this.render(hbs`{{calc-input onResult=(action 'result')}}`);

  // we build "9 + 88 / 2"
  this.$('button[data-number=9]').click();
  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-op=divide]').click();
  this.$('button[data-number=2]').click();

  this.$('.calc-input--commit-btn').click();
  this.$('.calc-input--commit-btn').click();
});

test('it adds classes to commit button depending on expr state', function(assert) {
  this.render(hbs`{{calc-input}}`);

  assert.ok(this.$('.calc-input--commit-btn').hasClass('commit'), 'When there are no number the btn has the commit class');

  this.$('button[data-number=9]').click();
  assert.ok(this.$('.calc-input--commit-btn').hasClass('commit'), 'When there is a number without op the btn has the commit class');

  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-op=divide]').click();
  this.$('button[data-number=2]').click();
  assert.ok(this.$('.calc-input--commit-btn').hasClass('calculate'), 'When there is an op the btn has the calculate class');

  this.$('.calc-input--commit-btn').click();
  assert.ok(this.$('.calc-input--commit-btn').hasClass('commit'));
});

test('it resets the playground', function(assert) {
  this.render(hbs`{{calc-input}}`);

  this.$('button[data-number=9]').click();
  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-op=divide]').click();
  this.$('button[data-number=2]').click();

  this.$('.calc-input--reset-btn').click();
  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 0`);
});

test('it deletes the playground string', function(assert) {
  this.render(hbs`{{calc-input}}`);

  this.$('button[data-number=9]').click();
  this.$('button[data-op=plus]').click();
  this.$('button[data-number=8]').click();
  this.$('button[data-number=8]').click();

  this.$('.calc-input--del-btn').click();
  assert.equal(this.$('.calc-input--playground').text().trim(), `${currency.symbol} 9 + 8`);
});
