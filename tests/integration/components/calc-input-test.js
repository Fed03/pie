import { findWithAssert, click } from "ember-native-dom-helpers";
import { moduleForComponent, test } from "ember-qunit";
import testSelector from "ember-test-selectors";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("calc-input", "Integration | Component | calc input", {
  integration: true
});

test("it renders", function(assert) {
  this.render(hbs`{{calc-input}}`);

  assert.ok(
    findWithAssert(testSelector("calculator")).classList.contains("calculator"),
    "It has the `calculator` class"
  );
});

test("it displays the correct value", function(assert) {
  this.render(hbs`{{calc-input value=value}}`);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0",
    "If value is undefined it starts at 0"
  );

  this.set("value", 123);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "123"
  );

  this.set("value", 123.5);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "123.5"
  );

  this.set("value", -123.5);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "-123.5"
  );

  this.set("value", -12345.6);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "-12,345.6"
  );
});

test("it display value depending on click", async function(assert) {
  this.render(hbs`{{calc-input value=value}}`);
  assert.equal(this.get("value"), undefined);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0"
  );

  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", 8));
  await click(testSelector("calc-key", 7));
  await click(testSelector("calc-key", "dot"));
  await click(testSelector("calc-key", 5));
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "987.5"
  );
  assert.equal(this.get("value"), undefined);
});

test("it displays the previous value when using an operand", async function(
  assert
) {
  this.render(hbs`{{calc-input}}`);
  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", 8));
  await click(testSelector("calc-key", "sum"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "98"
  );

  await click(testSelector("calc-key", 1));
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "1"
  );
});

test("it displays the correct result", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", 8));
  await click(testSelector("calc-key", "sum"));
  await click(testSelector("calc-key", 1));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "99"
  );

  await click(testSelector("calc-key", "subtract"));
  await click(testSelector("calc-key", 4));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "95"
  );

  await click(testSelector("calc-key", "divide"));
  await click(testSelector("calc-key", 5));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "19"
  );

  await click(testSelector("calc-key", "multiply"));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "57"
  );

  await click(testSelector("calc-key", "sum"));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "divide"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "60"
  );

  await click(testSelector("calc-key", 2));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "30"
  );
});

test("it clear the display", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "clear"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0"
  );

  await click(testSelector("calc-key", 2));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "subtract"));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "clear"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0"
  );

  await click(testSelector("calc-key", 4));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "19"
  );

  await click(testSelector("calc-key", "multiply"));
  await click(testSelector("calc-key", 1));
  await click(testSelector("calc-key", "clear"));
  await click(testSelector("calc-key", "clear"));
  await click(testSelector("calc-key", 7));
  await click(testSelector("calc-key", "equals"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "7"
  );
});

test("it toggles sign", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", 3));
  await click(testSelector("calc-key", "toggle-sign"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "-93"
  );

  await click(testSelector("calc-key", "toggle-sign"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "93"
  );
});

test("it deletes the last digit", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click(testSelector("calc-key", 9));
  await click(testSelector("calc-key", "deleteDigit"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0"
  );

  await click(testSelector("calc-key", 8));
  await click(testSelector("calc-key", 2));
  await click(testSelector("calc-key", "deleteDigit"));

  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "8"
  );
});
