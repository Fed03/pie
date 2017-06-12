import hbs from "htmlbars-inline-precompile";
import testSelector from "ember-test-selectors";
import { moduleForComponent, test } from "ember-qunit";
import { manualSetup, make, makeList } from "ember-data-factory-guy";
import { click, find, findWithAssert, findAll } from "ember-native-dom-helpers";

moduleForComponent(
  "category-selector-input",
  "Integration | Component | category selector input",
  {
    integration: true,
    beforeEach() {
      manualSetup(this.container);
    }
  }
);

test("it renders element", function(assert) {
  this.render(hbs`{{category-selector-input}}`);

  assert.ok(
    findWithAssert(testSelector("category-selector-input")).classList.contains(
      "category-selector-input"
    ),
    "It has the `.category-selector-input` class"
  );
});

test("it shows the selected category", function(assert) {
  this.set("categories", makeList("category", 3));
  this.set(
    "selectedCategory",
    make("category", {
      name: "Food",
      type: "income"
    })
  );
  this.render(
    hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories}}`
  );

  assert.equal(
    findWithAssert(testSelector("selected-category-name")).textContent.trim(),
    "Food",
    "It shows `Food`"
  );
});

test("it sends an action when category is selected", async function(assert) {
  let categories = makeList("category", 3);
  let singleCategory = make("category", {
    id: "foo",
    name: "bar"
  });
  categories.push(singleCategory);
  this.set("categories", categories);
  this.render(
    hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories onSelection=(action (mut selectedCategory))}}`
  );

  await click(testSelector("category-list-item", "foo-bar"));

  assert.equal(
    find(testSelector("selected-category-name")).textContent.trim(),
    "bar",
    "It shows `bar`"
  );
  assert.deepEqual(this.get("selectedCategory"), singleCategory);
});

test("it toggle the sidedrawer when clicked", async function(assert) {
  this.set("categories", makeList("category", 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  await click(testSelector("toggle-category-selector"));
  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-opened"
    )
  );

  await click(testSelector("toggle-category-selector"));
  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-closed"
    )
  );
});

test("it add a class when is clicked", async function(assert) {
  this.set("categories", makeList("category", 3));
  this.render(hbs`{{category-selector-input categories=categories}}`);

  await click(testSelector("toggle-category-selector"));

  assert.ok(
    find(testSelector("category-selector-input")).classList.contains(
      "category-selector-input-focused"
    ),
    "It has the `category-selector-input-focused` class"
  );
});

test("it adds a class if has a selected category", function(assert) {
  this.set("categories", makeList("category", 3));

  this.render(
    hbs`{{category-selector-input selectedCategory=selectedCategory categories=categories}}`
  );

  assert.notOk(
    find(testSelector("category-selector-input")).classList.contains(
      "category-selector-input-full"
    )
  );

  this.set(
    "selectedCategory",
    make("category", {
      name: "Food",
      type: "income"
    })
  );
  assert.ok(
    find(testSelector("category-selector-input")).classList.contains(
      "category-selector-input-full"
    )
  );
});

test("it closes the drawer when a category is selected", async function(
  assert
) {
  this.set("categories", makeList("category", 3));
  this.render(
    hbs`{{category-selector-input selectedCategoty=dummy categories=categories onSelection=(action (mut dummy))}}`
  );

  assert.ok(
    find(testSelector("sidedrawer")).classList.contains("sidedrawer-closed")
  );

  await click(testSelector("toggle-category-selector"));
  assert.ok(
    find(testSelector("sidedrawer")).classList.contains("sidedrawer-opened")
  );

  let categoryListItemElement = findAll(testSelector("category-list-item"))[0];
  await click(categoryListItemElement);
  assert.ok(
    find(testSelector("sidedrawer")).classList.contains("sidedrawer-closed")
  );
});
