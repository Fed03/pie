import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { find, findWithAssert, click } from "ember-native-dom-helpers";
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

test("it fires action when changing month", async function(assert) {
  assert.expect(4);
  let november2016 = new Date(2016, 10, 1, 0, 0, 0, 0);
  let currentMonth = make("month", { date: november2016 });
  this.set("currentMonth", currentMonth);

  this.on("prev", (date, month) => {
    let expectedDate = moment(november2016)
      .subtract(1, "months")
      .toDate();
    assert.deepEqual(month, currentMonth, "The passed month is equal to the currentMonth");
    assert.equal(date.getTime(), expectedDate.getTime());
  });

  this.on("next", (date, month) => {
    let expectedDate = moment(november2016)
      .add(1, "months")
      .toDate();
    assert.deepEqual(month, currentMonth, "The passed month is equal to the currentMonth");
    assert.equal(date.getTime(), expectedDate.getTime());
  });

  this.render(hbs`{{month-selector currentMonth=currentMonth nextMonthAction=(action 'next') prevMonthAction=(action 'prev')}}`);

  await click("[data-test-previous-month-btn]");
  await click("[data-test-next-month-btn]");
});
