import EmberObject from '@ember/object';
import { findAll, find } from "ember-native-dom-helpers";
import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("category-badge", "Integration | Component | category badge", {
  integration: true
});

test("it renders with the correct class", function(assert) {
  this.set(
    "category",
    EmberObject.create({
      name: "Food",
      type: "income"
    })
  );
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(findAll("div.category--badge").length, 1, "It has the '.category--badge' class");
});

test("it add a class based on the category type", function(assert) {
  this.set(
    "category",
    EmberObject.create({
      name: "Food",
      type: "income"
    })
  );
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(findAll("div.category--badge-income").length, 1, "It has the '.category--badge-income' class");

  this.set(
    "category",
    EmberObject.create({
      name: "Food",
      type: "outcome"
    })
  );

  assert.equal(findAll("div.category--badge-outcome").length, 1, "It has the '.category--badge-outcome' class");
});

test("it contains the abbrevation of the category name", function(assert) {
  this.set(
    "category",
    EmberObject.create({
      name: "Food",
      type: "income"
    })
  );
  this.render(hbs`{{category-badge category=category}}`);

  assert.equal(find("div.category--badge").textContent.trim(), "fd", "'food' is abbreviated in `fd`");

  this.set(
    "category",
    EmberObject.create({
      name: "Sport",
      type: "outcome"
    })
  );

  assert.equal(find("div.category--badge").textContent.trim(), "sp", "'sport' is abbreviated in `sp`");
});
