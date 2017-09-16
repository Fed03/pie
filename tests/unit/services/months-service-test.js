import { moduleFor, test } from "ember-qunit";
import { manualSetup, make } from "ember-data-factory-guy";
import destroyPouchDb from "pie/tests/helpers/destroy-db";

function monthDate(date) {
  let monthDate = new Date(date.getTime());
  monthDate.setHours(0, 0, 0, 0);
  monthDate.setDate(1);

  return monthDate;
}

moduleFor("service:months-service", "Unit | Service | months service", {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
    this.container.lookup("service:store").unloadAll();
    return destroyPouchDb();
  }
});

test("it fetches the current month", async function(assert) {
  let currentMonth = make("currentMonth");

  assert.deepEqual(await this.subject().findCurrentMonth(), currentMonth);
});

test("it creates the current month if not present and returns it", async function(assert) {
  make("user");
  let currentMonth = await this.subject().findCurrentMonth();

  assert.propEqual(currentMonth.get("date"), monthDate(new Date()));
});

test("it fetches a month by date", async function(assert) {
  let date = new Date(2017, 3, 21);
  let expectedMonth = make("month", { date: monthDate(date) });

  assert.deepEqual(await this.subject().findMonthByDate(date), expectedMonth);
});

test("it creates the month if not present and returns it", async function(assert) {
  make("user", {
    currentBalance: 123.45
  });
  let date = new Date(2017, 3, 21);
  let month = await this.subject().findMonthByDate(date);

  assert.propEqual(month.get("date"), monthDate(date));
  assert.equal(month.get("openingBalance"), 123.45);
});
