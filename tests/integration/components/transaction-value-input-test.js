import hbs from "htmlbars-inline-precompile";
import { moduleForComponent, test } from "ember-qunit";
import { click, find, findWithAssert } from "ember-native-dom-helpers";
import { fillCalcValue } from "calc-component/test-support/fill-calc-value";

moduleForComponent("transaction-value-input", "Integration | Component | transaction value input", {
  integration: true
});

test("It renders the element", function(assert) {
  assert.expect(0);
  this.render(hbs`{{transaction-value-input}}`);
  findWithAssert("[data-test-transaction-value-input]");
});

test("it sets the correct class based on the transaction type", function(assert) {
  this.set("transactionType", "income");

  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.ok(find("[data-test-transaction-value-input]").classList.contains("income-amount"), "It has the 'income-amount' class");
  assert.notOk(find("[data-test-transaction-value-input]").classList.contains("outcome-amount"), "It has not the 'outcome-amount' class");

  this.set("transactionType", "outcome");

  assert.ok(find("[data-test-transaction-value-input]").classList.contains("outcome-amount"), "It has the 'outcome-amount' class");
  assert.notOk(find("[data-test-transaction-value-input]").classList.contains("income-amount"), "It has not the 'income-amount' class");
});

test("it adds the sign according to transactionType", function(assert) {
  this.set("transactionType", "income");
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);

  assert.equal(find("[data-test-value-display]").textContent.trim(), "+0.00", "It has the plus sign");

  this.set("transactionType", "outcome");
  assert.equal(find("[data-test-value-display]").textContent.trim(), "-0.00", "It has the minus sign");
});

test("it adds a class on click", async function(assert) {
  this.render(hbs`{{transaction-value-input}}`);

  assert.notOk(findWithAssert("[data-test-transaction-value-input]").classList.contains("input-focused"));
  await click("[data-test-value-display]");
  assert.ok(findWithAssert("[data-test-transaction-value-input]").classList.contains("input-focused"));
});

test("it opens a modal on input click", async function(assert) {
  this.render(hbs`{{transaction-value-input}}`);

  assert.notOk(find(".ember-modal-dialog"));
  await click("[data-test-value-display]");
  assert.ok(find(".ember-modal-dialog"));
});

test("it adds sign on calc", async function(assert) {
  this.set("transactionType", "income");
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
  await click("[data-test-value-display]");

  await fillCalcValue("123");
  await click('[data-test-calc-key="equals"]');

  assert.equal(find("[data-test-value-display]").textContent.trim(), "+123.00");
});

test("it closes the overlay on calc", async function(assert) {
  this.set("transactionType", "income");
  this.render(hbs`{{transaction-value-input transactionType=transactionType}}`);
  await click("[data-test-value-display]");

  assert.ok(find(".ember-modal-dialog"), "The modal is visible");

  await fillCalcValue("123");
  await click('[data-test-calc-key="equals"]');

  assert.notOk(find(".ember-modal-dialog"), "The modal is hidden");
});

test("changing value updates the val", function(assert) {
  this.set("transactionType", "income");
  this.set("value", 123456.78);
  this.render(hbs`{{transaction-value-input transactionType=transactionType value=value}}`);

  assert.equal(find("[data-test-value-display]").textContent.trim(), "+123,456.78");

  this.set("value", 23.45);
  assert.equal(find("[data-test-value-display]").textContent.trim(), "+23.45");
});

test("it triggers an action", async function(assert) {
  assert.expect(2);

  let expected = -30;
  this.set("transactionType", "outcome");
  this.set("value", 10);
  this.on("update", function(newVal) {
    assert.equal(newVal, expected, "The action fired");
  });

  this.render(hbs`
    {{transaction-value-input
    transactionType=transactionType
    value=value
    update=(action 'update')
    }}`);

  await click("[data-test-value-display]");
  await fillCalcValue("-40");
  await click('[data-test-calc-key="equals"]');

  assert.notEqual(this.get("value"), expected, "The initial value was not changed");
});

test("it renders a label", function(assert) {
  this.render(hbs`{{transaction-value-input label="foo"}}`);
  let label = findWithAssert("label");
  assert.equal(label.textContent.trim(), "foo");
});
