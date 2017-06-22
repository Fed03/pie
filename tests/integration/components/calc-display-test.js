import { findWithAssert } from "ember-native-dom-helpers";
import { moduleForComponent, test } from "ember-qunit";
import testSelector from "ember-test-selectors";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("calc-display", "Integration | Component | calc display", {
  integration: true
});

test("it renders", function(assert) {
  this.render(hbs`{{calc-display}}`);

  assert.ok(
    findWithAssert(testSelector("calculator-display")).classList.contains(
      "calculator-display"
    ),
    "It has the `calculator-display` class"
  );
});

test("it displays the correct value", function(assert) {
  this.render(hbs`{{calc-display value=value}}`);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0",
    "If value is undefined it starts at 0"
  );

  this.set("value", "123");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "123"
  );

  this.set("value", "123.5");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "123.5"
  );

  this.set("value", "-123.5");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "-123.5"
  );

  this.set("value", "-12345.6");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "-12,345.6"
  );

  this.set("value", "1.");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "1."
  );

  this.set("value", "0.");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0."
  );

  this.set("value", "");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "0"
  );

  this.set("value", "1.0");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "1.0"
  );

  this.set("value", "1.30000");
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent.trim(),
    "1.30000"
  );
});
