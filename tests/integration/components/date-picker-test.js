import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { click, findWithAssert, find } from "ember-native-dom-helpers";
import testSelector from "ember-test-selectors";

moduleForComponent("date-picker", "Integration | Component | date picker", {
  integration: true
});

test("it renders", function(assert) {
  assert.expect(0);
  this.render(hbs`{{date-picker}}`);
  let el = findWithAssert(testSelector("date-picker"));
  findWithAssert(testSelector("date-picker-input"), el);
});

test("it opens a modal on input click", async function(assert) {
  this.render(hbs`{{date-picker}}`);

  assert.notOk(find(".ember-modal-dialog"));
  await click(testSelector("date-picker-input"));
  assert.ok(find(".ember-modal-dialog"));
});

test("the modal has an overlay", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click(testSelector("date-picker-input"));

  assert.ok(find(".ember-modal-overlay"));
});

test("it closes the modal when clicking on the overlay", async function(
  assert
) {
  this.render(hbs`{{date-picker}}`);
  await click(testSelector("date-picker-input"));
  await click(".ember-modal-overlay");
  assert.notOk(find(".ember-modal-dialog"));
});
