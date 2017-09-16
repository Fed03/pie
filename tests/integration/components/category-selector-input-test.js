import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";
import { manualSetup, make } from "ember-data-factory-guy";
import { click, find, findWithAssert } from "ember-native-dom-helpers";

moduleForComponent("category-selector-input", "Integration | Component | category selector input", {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test("it renders element", function(assert) {
  this.render(hbs`{{category-selector-input}}`);

  assert.ok(
    findWithAssert("[data-test-category-selector-input]").classList.contains("category-selector-input"),
    "It has the `.category-selector-input` class"
  );
});

test("it shows the selected category", function(assert) {
  this.set(
    "selectedCategory",
    make("category", {
      name: "Food",
      type: "income"
    })
  );
  this.render(hbs`{{category-selector-input selectedCategory=selectedCategory}}`);

  assert.equal(findWithAssert("[data-test-selected-category-name]").textContent.trim(), "Food", "It shows `Food`");
});

test("it sends an action when clicked", async function(assert) {
  assert.expect(1);
  this.on("clicked", () => {
    assert.ok(true);
  });
  this.render(hbs`{{category-selector-input onClick=(action 'clicked')}}`);

  await click("[data-test-category-selector-input]");
});

test("it add a class when is clicked", async function(assert) {
  this.render(hbs`{{category-selector-input}}`);

  await click("[data-test-category-selector-input]");

  assert.ok(find("[data-test-category-selector-input]").classList.contains("focused"), "It has the `focused` class");
});

test("it renders a label", function(assert) {
  this.render(hbs`{{category-selector-input label="foo"}}`);
  let label = findWithAssert("label");
  assert.equal(label.textContent.trim(), "foo");
});
