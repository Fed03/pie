import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { manualSetup, make, makeList } from 'ember-data-factory-guy';

moduleForComponent('category-selector-input', 'Integration | Component | category selector input', {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it renders the span element', function(assert) {
  this.set('categories', makeList('category', 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  assert.equal(this.$('span.category-selector-input').length, 1, 'It\'s a span element');
});

test('it shows the selected category', function(assert) {
  this.set('categories', makeList('category', 3));
  this.set('selectedCategory', make('category', {
    name: 'Food',
    type: 'income'
  }));
  this.render(hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories}}`);

  assert.equal(this.$('[data-test-selector=selected-category-name]').text().trim(), 'Food', 'It shows `Food`');
});
