import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-selector-input', 'Integration | Component | category selector input', {
  integration: true
});

test('it renders the span element', function(assert) {
  this.render(hbs`{{category-selector-input}}`);

  assert.equal(this.$('span').length, 1, 'It\'s a span element');
});

test('it shows the selected category', function(assert) {
  this.set('category', Ember.Object.create({
    name: 'Food',
    type: 'income'
  }));
  this.render(hbs`{{category-selector-input selectedCategory=category}}`);

  assert.equal(this.$('[data-test-selector=selected-category-name]').text().trim(), 'Food', 'It shows `Food`');
});
