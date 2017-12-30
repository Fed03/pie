import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { find, findWithAssert } from "ember-native-dom-helpers";

moduleForComponent("month-selector", "Integration | Component | month selector", {
  integration: true
});

test("it renders the required html", function(assert) {
  assert.expect(0);
  this.render(hbs`{{month-selector}}`);

  findWithAssert("[data-test-month-selector]");
  findWithAssert("a[data-test-next-month-btn]");
  findWithAssert("a[data-test-previous-month-btn]");
  findWithAssert("[data-test-current-month]");
});
