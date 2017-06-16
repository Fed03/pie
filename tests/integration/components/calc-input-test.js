import { findWithAssert } from "ember-native-dom-helpers";
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
    findWithAssert(testSelector("calculator-display")).textContent,
    "0",
    "If value is undefined it starts at 0"
  );

  this.set("value", 123);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent,
    "123"
  );

  this.set("value", 123.5);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent,
    "123.5"
  );

  this.set("value", -123.5);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent,
    "-123.5"
  );

  this.set("value", -12345.6);
  assert.equal(
    findWithAssert(testSelector("calculator-display")).textContent,
    "-12,345.6"
  );
});
