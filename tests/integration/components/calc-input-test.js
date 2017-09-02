import { findWithAssert, click } from "ember-native-dom-helpers";
import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { initialize, triggerKeyDown } from "ember-keyboard";
import { fillCalcValue } from "calc-component/test-support/fill-calc-value";

moduleForComponent("calc-input", "Integration | Component | calc input", {
  integration: true,
  beforeEach() {
    initialize();
  }
});

test("it renders", function(assert) {
  this.render(hbs`{{calc-input}}`);

  assert.ok(
    findWithAssert('[data-test-calculator]').classList.contains("calculator"),
    "It has the `calculator` class"
  );
});

test("it displays the correct value", function(assert) {
  this.render(hbs`{{calc-input value=value}}`);
  assert.equal(
    findWithAssert('[data-test-calculator-display]').textContent.trim(),
    "0",
    "If value is undefined it starts at 0"
  );

  this.set("value", 123);
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "123");

  this.set("value", 123.5);
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "123.5");

  this.set("value", -123.5);
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "-123.5");

  this.set("value", -12345.6);
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "-12,345.6");
});

test("it display value depending on click", async function(assert) {
  this.render(hbs`{{calc-input value=value}}`);
  assert.equal(this.get("value"), undefined);
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="8"]');
  await click('[data-test-calc-key="7"]');
  await click('[data-test-calc-key="dot"]');
  await click('[data-test-calc-key="5"]');
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "987.5");
  assert.equal(this.get("value"), undefined);
});

test("it shows the dot even with leading zero", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="dot"]');
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0.");

  await click('[data-test-calc-key="5"]');
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0.5");
});

test("it displays the previous value when using an operand", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="8"]');
  await click('[data-test-calc-key="sum"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "98");

  await click('[data-test-calc-key="1"]');
  await click('[data-test-calc-key="2"]');
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "12");
});

test("it displays the correct result", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="8"]');
  await click('[data-test-calc-key="sum"]');
  await click('[data-test-calc-key="1"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "99");

  await click('[data-test-calc-key="subtract"]');
  await click('[data-test-calc-key="4"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "95");

  await click('[data-test-calc-key="divide"]');
  await click('[data-test-calc-key="5"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "19");

  await click('[data-test-calc-key="multiply"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "57");

  await click('[data-test-calc-key="sum"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="divide"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "60");

  await click('[data-test-calc-key="2"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "30");
});

test("it clear the display", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="clear"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  await click('[data-test-calc-key="2"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="subtract"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="clear"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  await click('[data-test-calc-key="4"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "19");

  await click('[data-test-calc-key="multiply"]');
  await click('[data-test-calc-key="1"]');
  await click('[data-test-calc-key="clear"]');
  await click('[data-test-calc-key="clear"]');
  await click('[data-test-calc-key="7"]');
  await click('[data-test-calc-key="equals"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "7");
});

test("it toggles sign", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="3"]');
  await click('[data-test-calc-key="toggle-sign"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "-93");

  await click('[data-test-calc-key="toggle-sign"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "93");
});

test("it deletes the last digit", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="deleteDigit"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  await click('[data-test-calc-key="8"]');
  await click('[data-test-calc-key="2"]');
  await click('[data-test-calc-key="deleteDigit"]');

  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "8");
});

test("It changes the clear btn text", async function(assert) {
  this.render(hbs`{{calc-input}}`);
  assert.equal(findWithAssert('[data-test-calc-key="clear"]').textContent.trim(), "AC");

  await click('[data-test-calc-key="9"]');

  assert.equal(findWithAssert('[data-test-calc-key="clear"]').textContent.trim(), "C");

  await click('[data-test-calc-key="clear"]');

  assert.equal(findWithAssert('[data-test-calc-key="clear"]').textContent.trim(), "AC");
});

test("it listens for numpad events", function(assert) {
  this.render(hbs`{{calc-input}}`);

  triggerKeyDown("Numpad1");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "1");

  triggerKeyDown("Backspace");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  triggerKeyDown("Numpad2");
  triggerKeyDown("Numpad3");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "23");

  triggerKeyDown("NumpadAdd");
  triggerKeyDown("Numpad4");
  triggerKeyDown("Numpad5");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "45");

  triggerKeyDown("NumpadEnter");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "68");

  triggerKeyDown("NumpadSubtract");
  triggerKeyDown("Numpad6");
  triggerKeyDown("NumpadEnter");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "62");

  triggerKeyDown("NumpadMultiply");
  triggerKeyDown("Numpad7");
  triggerKeyDown("NumpadEnter");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "434");

  triggerKeyDown("NumpadDivide");
  triggerKeyDown("Numpad8");
  triggerKeyDown("NumpadEnter");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "54.25");

  triggerKeyDown("Delete");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0");

  triggerKeyDown("NumpadDecimal");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0.");

  triggerKeyDown("Numpad0");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0.0");

  triggerKeyDown("Numpad9");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "0.09");
});

test("it sends an action on equals", async function(assert) {
  assert.expect(1);

  this.on("equals", result => {
    assert.equal(result, 987.5);
  });
  this.render(hbs`{{calc-input onEquals=(action 'equals')}}`);

  await click('[data-test-calc-key="9"]');
  await click('[data-test-calc-key="8"]');
  await click('[data-test-calc-key="7"]');
  await click('[data-test-calc-key="dot"]');
  await click('[data-test-calc-key="5"]');

  await click('[data-test-calc-key="equals"]');
});

test("fillCalcValue helper", async function(assert) {
  this.render(hbs`{{calc-input value=300}}`);

  await fillCalcValue("-345.32");
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "345.32");

  await click('[data-test-calc-key="equals"]');
  assert.equal(findWithAssert('[data-test-calculator-display]').textContent.trim(), "-45.32");
});
