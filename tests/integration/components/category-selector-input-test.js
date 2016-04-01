import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { manualSetup, make, makeList } from 'ember-data-factory-guy';

moduleForComponent('category-selector-input', 'Integration | Component | category selector input', {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test('it renders element', function(assert) {
  this.set('categories', makeList('category', 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  assert.equal(this.$('.category-selector-input').length, 1);
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

test('it sends an action when category is selected', function(assert) {
  let categories = makeList('category', 3);
  let singleCategory = make('category', {
    id: 'foo',
    name: 'bar'
  });
  categories.push(singleCategory);
  this.set('categories', categories);
  this.render(hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories onSelection=(action (mut selectedCategory))}}`);

  this.$(`li[data-category=foo-bar]`).click();

  assert.equal(this.$('[data-test-selector=selected-category-name]').text().trim(), 'bar', 'It shows `bar`');
  assert.deepEqual(this.get('selectedCategory'), singleCategory);
});

test('it toggle the sidedrawer when clicked', function(assert) {
  this.set('categories', makeList('category', 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  this.$('.category-selector-input > span').click();
  assert.ok(this.$('.sidedrawer').hasClass('sidedrawer-opened'));

  this.$('.category-selector-input > span').click();
  assert.ok(this.$('.sidedrawer').hasClass('sidedrawer-closed'));
});

test('it add a class when is clicked', function(assert) {
  this.set('categories', makeList('category', 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  this.$('.category-selector-input > span').click();

  assert.ok(this.$('.category-selector-input').hasClass('category-selector-input-focused'),
    'It has the `category-selector-input-focused` class');
});

test('it adds a class if has a selected category', function(assert) {
  this.set('categories', makeList('category', 3));

  this.render(hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories}}`);

  assert.notOk(this.$('.category-selector-input').hasClass('category-selector-input-full'));

  this.set('selectedCategory', make('category', {
    name: 'Food',
    type: 'income'
  }));
  assert.ok(this.$('.category-selector-input').hasClass('category-selector-input-full'));
});

test('it closes the drawer when a category is selected', function(assert) {
  this.set('categories', makeList('category', 3));
  this.render(hbs`{{category-selector-input selectedCategoty=dummy categories=categories onSelection=(action (mut dummy))}}`);

  assert.ok(this.$('.sidedrawer').hasClass('sidedrawer-closed'));

  this.$('.category-selector-input > span').click();
  assert.ok(this.$('.sidedrawer').hasClass('sidedrawer-opened'));

  this.$(`li.list-item`).first().click();
  assert.ok(this.$('.sidedrawer').hasClass('sidedrawer-closed'));
});
