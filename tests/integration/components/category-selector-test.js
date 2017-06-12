import hbs from "htmlbars-inline-precompile";
import testSelector from "ember-test-selectors";
import { moduleForComponent, test } from "ember-qunit";
import { click, findAll, findWithAssert } from "ember-native-dom-helpers";
import { manualSetup, make, makeList } from "ember-data-factory-guy";

moduleForComponent(
  "category-selector",
  "Integration | Component | category selector",
  {
    integration: true,
    beforeEach() {
      manualSetup(this.container);
    }
  }
);

test("it renders", function(assert) {
  this.render(hbs`{{category-selector}}`);

  assert.ok(
    findWithAssert(testSelector("category-selector")).classList.contains(
      "category--selector"
    ),
    "It has the `.category--selector` class"
  );
});

test("it renders the categories list", function(assert) {
  let categories = makeList("category", 5);
  this.set("categories", categories);
  this.render(hbs`{{category-selector categories=categories}}`);

  assert.equal(
    findAll(testSelector("category-list-item")).length,
    5,
    "It shows 5 category list items"
  );
});

test("it sends an action when a category is clicked", async function(assert) {
  let categories = makeList("category", 5);
  let singleCategory = make("category", {
    id: 2,
    name: "bar"
  });
  categories.push(singleCategory);

  this.set("categories", categories);
  this.on("categorySelected", function(selectedCategory) {
    assert.deepEqual(selectedCategory, singleCategory);
  });

  this.render(
    hbs`{{category-selector categories=categories onSelection=(action 'categorySelected')}}`
  );

  await click(testSelector("category-list-item", "2-bar"));
});

test("it divides the categories based on type", function(assert) {
  let incomeCategories = makeList("category", 2, { type: "income" });
  let outcomeCategories = makeList("category", 4, { type: "outcome" });

  let categories = incomeCategories.concat(outcomeCategories);
  this.set("categories", categories);
  this.render(hbs`{{category-selector categories=categories}}`);

  assert.equal(
    findWithAssert(
      testSelector("category-list-by-type", "income")
    ).querySelectorAll(testSelector("category-list-item")).length,
    2,
    "The income categories are grouped together"
  );
  assert.equal(
    findWithAssert(
      testSelector("category-list-by-type", "outcome")
    ).querySelectorAll(testSelector("category-list-item")).length,
    4,
    "The outcome categories are grouped together"
  );
});

test("it lists the categories in alphabetical order", function(assert) {
  this.set("categories", [
    make("category", { name: "foo", type: "income" }),
    make("category", { name: "bar", type: "income" }),
    make("category", { name: "baz", type: "outcome" }),
    make("category", { name: "zoo", type: "outcome" })
  ]);
  this.render(hbs`{{category-selector categories=categories}}`);

  let incomeList = findWithAssert(
    testSelector("category-list-by-type", "income")
  ).querySelectorAll(testSelector("category-name"));

  let outcomeList = findWithAssert(
    testSelector("category-list-by-type", "outcome")
  ).querySelectorAll(testSelector("category-name"));

  assert.equal(incomeList[0].textContent, "bar");
  assert.equal(incomeList[1].textContent, "foo");
  assert.equal(outcomeList[0].textContent, "baz");
  assert.equal(outcomeList[1].textContent, "zoo");
});
