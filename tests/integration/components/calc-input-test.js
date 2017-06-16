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
