import hbs from "htmlbars-inline-precompile";
import testSelector from "ember-test-selectors";
import { moduleForComponent, test } from "ember-qunit";
import { click, find, findWithAssert } from "ember-native-dom-helpers";

moduleForComponent("transaction-value-input", "Integration | Component | transaction value input", {
  integration: true
});

test("It renders the element", function(assert) {
  assert.expect(0);
  this.render(hbs`{{transaction-value-input}}`);
  findWithAssert(testSelector("transaction-value-input"));
});

test("it sets the correct class based on the transaction type", function(assert) {
  this.set("transactionType", "income");

  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.ok(find(testSelector("transaction-value-input")).classList.contains("income-amount"), "It has the 'income-amount' class");
  assert.notOk(find(testSelector("transaction-value-input")).classList.contains("outcome-amount"), "It has not the 'outcome-amount' class");

  this.set("transactionType", "outcome");

  assert.ok(find(testSelector("transaction-value-input")).classList.contains("outcome-amount"), "It has the 'outcome-amount' class");
  assert.notOk(find(testSelector("transaction-value-input")).classList.contains("income-amount"), "It has not the 'income-amount' class");
});

test("it adds the sign according to transactionType", function(assert) {
  this.set("transactionType", "income");
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.equal(find(testSelector("value-display")).textContent.trim(), "+0.00", "It has the plus sign");

  this.set("transactionType", "outcome");
  assert.equal(find(testSelector("value-display")).textContent.trim(), "-0.00", "It has the minus sign");
});

test("it adds a class on click", async function(assert) {
  this.render(hbs`{{transaction-value-input}}`);

  assert.notOk(findWithAssert(testSelector("transaction-value-input")).classList.contains("input-focused"));
  await click(testSelector("value-display"));
  assert.ok(findWithAssert(testSelector("transaction-value-input")).classList.contains("input-focused"));
});

test("it opens a modal on input click", async function(assert) {
  this.render(hbs`{{transaction-value-input}}`);

  assert.notOk(find(".ember-modal-dialog"));
  await click(testSelector("transaction-value-input"));
  assert.ok(find(".ember-modal-dialog"));
});
//
// test("it adds sign on calc", async function(assert) {
//   this.set("transactionType", "income");
//   this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
//   await click(testSelector("value-display"));
//
//   await click("[data-number=1]");
//   await click("[data-number=2]");
//   await click("[data-number=3]");
//   await click(".calc-input--commit-btn");
//
//   assert.equal(
//     find(testSelector("value-display")).textContent.trim(),
//     "+123.00"
//   );
// });
//
// test("it closes the overlay on calc", async function(assert) {
//   this.set("transactionType", "income");
//   this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
//   await click(testSelector("value-display"));
//
//   assert.equal(findAll(".overlay").length, 1, "The overlay is visible");
//
//   await click("[data-number=1]");
//   await click("[data-number=2]");
//   await click("[data-number=3]");
//   await click(".calc-input--commit-btn");
//
//   assert.equal(findAll(".overlay").length, 0, "The overlay is hidden");
// });

test("changing value updates the val", function(assert) {
  this.set("transactionType", "income");
  this.set("value", 123456.78);
  this.render(hbs`{{transaction-value-input transactionType=transactionType value=value}}`);

  assert.equal(find(testSelector("value-display")).textContent.trim(), "+123,456.78");

  this.set("value", 23.45);
  assert.equal(find(testSelector("value-display")).textContent.trim(), "+23.45");
});

// test("it trigger an action", async function(assert) {
//   assert.expect(2);
//
//   let expected = -30;
//   this.set("transactionType", "outcome");
//   this.set("value", 10);
//   this.on("update", function(newVal) {
//     assert.equal(newVal, expected, "The action fired");
//   });
//
//   this.render(hbs`
//     {{transaction-value-input
//     transactionType=transactionType
//     value=value
//     update=(action 'update')
//     }}`);
//
//   await click(testSelector("value-display"));
//   await click("[data-op=minus]");
//   await click("[data-number=4]");
//   await click("[data-number=0]");
//   await click(".calc-input--commit-btn");
//   await click(".calc-input--commit-btn");
//
//   assert.notEqual(
//     this.get("value"),
//     expected,
//     "The initial value was not changed"
//   );
// });
