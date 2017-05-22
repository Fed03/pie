import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('category-badge', 'Integration | Component | category badge', {
  integration: true
});

test('it renders with the correct class', function(assert) {
  this.set('category', Ember.Object.create({
    name: 'Food',
    type: 'income'
  }));
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(this.$('div.category--badge').length, 1, 'It has the \'.category--badge\' class');
});

test('it add a class based on the category type', function(assert) {
  this.set('category', Ember.Object.create({
    name: 'Food',
    type: 'income'
  }));
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(this.$('div.category--badge-income').length, 1, 'It has the \'.category--badge-income\' class');

  this.set('category', Ember.Object.create({
    name: 'Food',
    type: 'outcome'
  }));

  assert.equal(this.$('div.category--badge-outcome').length, 1, 'It has the \'.category--badge-outcome\' class');
});

test('it contains the abbrevation of the category name', function(assert) {
  this.set('category', Ember.Object.create({
    name: 'Food',
    type: 'income'
  }));
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(this.$('div.category--badge').text().trim(), 'fd', '\'food\' is abbreviated in `fd`');

  this.set('category', Ember.Object.create({
    name: 'Sport',
    type: 'outcome'
  }));

  assert.equal(this.$('span').text().trim(), 'sp', '\'sport\' is abbreviated in `sp`');
});
