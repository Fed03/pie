import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('side-drawer', 'Integration | Component | side drawer', {
  integration: true
});

test('it renders as aside with `sidedrawer` class', function(assert) {
  this.render(hbs`
    {{#side-drawer}}
      template block text
    {{/side-drawer}}
  `);
  assert.equal(this.$().text().trim(), 'template block text');
  assert.equal(this.$('aside.sidedrawer').length, 1);
});

test('it sets position and class depending on position property',
function(assert) {
  this.set('position', 'left');
  this.render(hbs`
    {{#side-drawer position=position}}
      template block text
    {{/side-drawer}}
  `);

  assert.equal(this.$('aside.sidedrawer-left-positioned').length, 1,
    'It has the `sidedrawer-left-positioned` class');

  this.set('position', 'right');
  assert.equal(this.$('aside.sidedrawer-right-positioned').length, 1,
    'It has the `sidedrawer-right-positioned` class');
});

test('it sets class depending on isOpen property', function(assert) {
  this.set('isOpen', true);
  this.render(hbs`
    {{#side-drawer isOpen=isOpen}}
      template block text
    {{/side-drawer}}
  `);

  assert.ok(this.$('aside').hasClass('sidedrawer-opened'),
    'It has the `sidedrawer-opened` class');
  assert.notOk(this.$('aside').hasClass('sidedrawer-closed'),
    'It has not the `sidedrawer-closed` class');

  this.set('isOpen', false);
  assert.ok(this.$('aside').hasClass('sidedrawer-closed'),
    'It has the `sidedrawer-closed` class');
  assert.notOk(this.$('aside').hasClass('sidedrawer-opened'),
    'It has not the `sidedrawer-opened` class');
});

test('it sets the top css property based on parent position', function(assert) {
  this.render(hbs`
    {{#side-drawer}}
      template block text
    {{/side-drawer}}
  `);

  assert.equal(parseInt(this.$('aside').css('top')), parseInt(this.$().position().top));
});

test('it sets a class on sibling depending on position property',
function(assert) {
  this.set('position', 'left');
  this.render(hbs`
    <div class="sidedrawer-sibling">foo</div>
    {{#side-drawer position=position}}
      template block text
    {{/side-drawer}}
  `);

  assert.ok(this.$('.sidedrawer-sibling').hasClass('sidedrawer-sibling-left'),
    'The sibling has the `sidedrawer-sibling-left` class');

  this.set('position', 'right');
  assert.ok(this.$('.sidedrawer-sibling').hasClass('sidedrawer-sibling-right'),
    'The sibling has the `sidedrawer-sibling-right` class');
});

test('it sets class on sibling depending on isOpen property', function(assert) {
  this.set('isOpen', true);
  this.render(hbs`
    <div class="sidedrawer-sibling">foo</div>
    {{#side-drawer isOpen=isOpen}}
      template block text
    {{/side-drawer}}
  `);

  assert.ok(this.$('.sidedrawer-sibling').hasClass('sidedrawer-sibling-opened'),
    'The .sibling has the `sidedrawer-sibling-opened` class');

  this.set('isOpen', false);
  assert.notOk(this.$('.sidedrawer-sibling').hasClass('sidedrawer-sibling-opened'),
    'The .sibling has not the `sidedrawer-sibling-opened` class');
});
