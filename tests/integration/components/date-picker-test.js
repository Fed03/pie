import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import {
  click,
  findWithAssert,
  find,
  findAll
} from "ember-native-dom-helpers";
import {
  calendarSelect,
  initCalendarHelpers
} from "ember-power-calendar/test-support";

moduleForComponent("date-picker", "Integration | Component | date picker", {
  integration: true,
  beforeEach() {
    initCalendarHelpers(this.container);
  }
});

test("it renders", function(assert) {
  assert.expect(0);
  this.render(hbs`{{date-picker}}`);
  let el = findWithAssert("[data-test-date-picker]");
  findWithAssert("[data-test-date-picker-input]", el);
});

test("it opens a modal on input click", async function(assert) {
  this.render(hbs`{{date-picker}}`);

  assert.notOk(find(".ember-modal-dialog"));
  await click("[data-test-date-picker-input]");
  assert.ok(find(".ember-modal-dialog"));
});

test("the modal has an overlay", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");

  assert.ok(find(".ember-modal-overlay"));
});

test("it closes the modal when clicking on the overlay", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");
  await click(".ember-modal-overlay");
  assert.notOk(find(".ember-modal-dialog"));
});

test("it displays a calendar", async function(assert) {
  assert.expect(0);
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");
  findWithAssert(".ember-power-calendar");
});

test("it sets the input val on date selection", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");
  await calendarSelect(".ember-power-calendar", new Date(2017, 6, 2));

  assert.equal(find("[data-test-date-picker-input]").value, "7/2/2017");
});

test("it sends an action on date selection", async function(assert) {
  assert.expect(1);
  let date = new Date(2017, 6, 2);
  this.on("select", selectedDate => {
    assert.propEqual(selectedDate, date);
  });

  this.render(hbs`{{date-picker onSelect=(action "select")}}`);
  await click("[data-test-date-picker-input]");
  await calendarSelect(".ember-power-calendar", date);
});

test("it sets initial value", async function(assert) {
  let date = new Date(2016, 6, 2);
  this.set("date", date);
  this.render(hbs`{{date-picker value=date}}`);

  assert.equal(find("[data-test-date-picker-input]").value, "7/2/2016");
  await click("[data-test-date-picker-input]");

  assert.ok(findWithAssert('[data-date="2016-07-02"]').classList.contains("ember-power-calendar-day--selected"));
});

test("it closes the modal when a day is selected", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");
  await calendarSelect(".ember-power-calendar", new Date(2017, 6, 2));
  assert.notOk(find(".ember-modal-dialog"));
});

test("the calendar can change month", async function(assert) {
  this.render(hbs`{{date-picker}}`);
  await click("[data-test-date-picker-input]");
  assert.equal(findAll(".ember-power-calendar-nav-control").length, 2, "The calendar has arrows to change month");
});

test("it renders a label", function(assert) {
  this.render(hbs`{{date-picker label="foo"}}`);
  let label = findWithAssert("label");
  assert.equal(label.textContent.trim(), "foo");
});
