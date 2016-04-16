import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('value-input', 'Integration | Component | value input', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('value', 12345.67);
  this.render(hbs`{{value-input value=value sign=sign}}`);

  assert.equal(this.$().text().trim(), '');
});
