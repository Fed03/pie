import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import { manualSetup, make, makeList } from 'ember-data-factory-guy';

moduleForComponent('category-selector', 'Integration | Component | category selector', {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it renders the categories list', function(assert) {
  let categories = makeList('category', 5);
  this.set('categories', categories);
  this.render(hbs`{{category-selector categories=categories}}`);

  assert.equal(this.$('li.category-list-item').length, 5);

  let firstCategory = categories[0];
  assert.equal(this.$(`li[data-category=${firstCategory.get('id')}-${firstCategory.get('name')}]`).length, 1, 'It adds a data-category attr to list item');
});

test('it send an action when a category is clicked', function(assert) {
  let categories = makeList('category', 5);
  let singleCategory = make('category', {
    id: 'foo',
    name: 'bar'
  });
  categories.push(singleCategory);

  this.set('categories', categories);
  this.on('categorySelected', function(selectedCategory) {
    assert.deepEqual(selectedCategory, singleCategory);
  });

  this.render(hbs`{{category-selector categories=categories onSelection=(action 'categorySelected')}}`);

  this.$(`li[data-category=foo-bar]`).click();
});
