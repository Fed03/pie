import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { find, findWithAssert } from "ember-native-dom-helpers";
import { manualSetup, make } from "ember-data-factory-guy";

moduleForComponent("month-selector", "Integration | Component | month selector", {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
  }
});

test("it renders the required html", function(assert) {
  assert.expect(0);
  this.set("month", make("currentMonth"));
  this.render(hbs`{{month-selector currentMonth=month}}`);

  findWithAssert("[data-test-month-selector]");
  findWithAssert("a[data-test-next-month-btn]");
  findWithAssert("a[data-test-previous-month-btn]");
  findWithAssert("[data-test-current-month]");
});

test("it displays the current month name and year", function(assert) {
  let november2016 = new Date(2016, 10, 1, 0, 0, 0, 0);
  this.set("month", make("month", { date: november2016 }));
  this.render(hbs`{{month-selector currentMonth=month}}`);

  assert.equal(find("[data-test-current-month]").textContent.trim(), "November 2016");
});
