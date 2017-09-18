import Ember from "ember";
import moment from "moment";
import { test } from "qunit";
import { click, findAll, find, visit } from "ember-native-dom-helpers";
import moduleForAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

const { run } = Ember;

function getCurrentMonthName() {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const today = new Date();

  return months[today.getMonth()];
}

moduleForAcceptance("Acceptance | month view", {
  async beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
    await create("user");
  }
});

test("visiting `/` redirects to the current month", async function(assert) {
  const currentMonth = await create("currentMonth", {
    openingBalance: 342.58
  });

  await visit("/");

  assert.equal(currentRouteName(), "months.view");
  assert.equal(currentURL(), `/months/${currentMonth.get("id")}`);
  assert.ok(
    find("[data-test-month-name]")
      .textContent.trim()
      .toLowerCase()
      .includes(getCurrentMonthName()),
    "The page shows the current month name"
  );

  assert.equal(
    findWithAssert("[data-test-opening-balance-value]")
      .text()
      .trim(),
    "€ 342.58",
    "The opening balance is correctly displayed"
  );
  assert.equal(
    findWithAssert("[data-test-month-balance-value]")
      .text()
      .trim(),
    "€ 0.00",
    "The month balance is zero"
  );
  assert.equal(
    findWithAssert("[data-test-current-balance-value]")
      .text()
      .trim(),
    "€ 342.58",
    "The current balance"
  );
});

test("it creates current month if not present", async function(assert) {
  let user = (await this.store.findAll("user")).get("firstObject");
  await Ember.run(() => {
    user.set("currentBalance", 1233.98);
    return user.save();
  });

  let months = await this.store.findAll("month");
  assert.equal(months.get("length"), 0, "There are no months");

  await visit("/");
  months = await this.store.findAll("month");
  assert.equal(months.get("length"), 1, "There is a month");

  const currentMonth = months.get("firstObject");

  assert.equal(currentRouteName(), "months.view");
  assert.equal(currentURL(), `/months/${currentMonth.get("id")}`);
  assert.ok(
    find("[data-test-month-name]")
      .textContent.trim()
      .toLowerCase()
      .includes(getCurrentMonthName()),
    "The page shows the current month name"
  );

  assert.equal(
    findWithAssert("[data-test-opening-balance-value]")
      .text()
      .trim(),
    "€ 1,233.98",
    "The opening balance is correctly displayed"
  );
  assert.equal(
    findWithAssert("[data-test-month-balance-value]")
      .text()
      .trim(),
    "€ 0.00",
    "The month balance is zero"
  );
  assert.equal(
    findWithAssert("[data-test-current-balance-value]")
      .text()
      .trim(),
    "€ 1,233.98",
    "The current balance"
  );
});

test("viewing a month without transaction will result in an empty page", async function(assert) {
  const currentMonth = await create("currentMonth");

  await visit(`/months/${currentMonth.get("id")}`);

  assert.ok(
    findWithAssert("[data-test-transactions-container]")
      .text()
      .trim()
      .split(" ")
      .join(" "),
    "No transactions. Add (+) some!"
  );
  assert.equal(findAll("[data-test-transaction-item]").length, 0);
});

test("viewing a month will list its transactions", async function(assert) {
  assert.expect(3);
  const today = moment().utc();
  const todayDate = today.date();

  let transactions = [
    await create("transaction", "yesterday"),
    await create("transaction", "yesterday"),
    await create("transaction", "yesterday"),
    ...(await createList("transaction", 2))
  ];

  const currentMonth = await create("currentMonth", {
    transactions
  });

  transactions.forEach(async transaction => {
    await run(() => {
      transaction.set("month", currentMonth);
      return transaction.save();
    });
  });

  await visit(`/months/${currentMonth.get("id")}`);
  assert.equal(findAll("[data-test-transaction-panel-for-day]").length, 2, "The month has 2 days with transactions");

  assert.equal(
    find(`[data-test-transaction-panel-for-day="${todayDate}"]`).querySelectorAll("[data-test-transaction-item]").length,
    2,
    "Today panel has 2 transactions"
  );

  let yesterday = today.subtract(1, "days").date();
  assert.equal(
    find(`[data-test-transaction-panel-for-day="${yesterday}"]`).querySelectorAll("[data-test-transaction-item]").length,
    3,
    "Yesterday panel has 3 transactions"
  );
});

test("clicking on the add button redirects to transaction.create", async function(assert) {
  assert.expect(1);
  const currentMonth = await create("currentMonth");

  await visit(`/months/${currentMonth.get("id")}`);
  await click("[data-test-new-transaction-btn]");

  assert.equal(currentRouteName(), "transactions.create");
});

test("it computes the total balance", async function(assert) {
  let transactions = [
    await create("transaction", { value: 5 }),
    await create("transaction", { value: -60 }),
    ...(await createList("transaction", 3, { value: 10 }))
  ];

  const currentMonth = await create("currentMonth", {
    openingBalance: 339,
    transactions
  });

  transactions.forEach(async transaction => {
    await run(() => {
      transaction.set("month", currentMonth);
      return transaction.save();
    });
  });

  await visit(`/months/${currentMonth.get("id")}`);
  assert.equal(
    findWithAssert("[data-test-opening-balance-value]")
      .text()
      .trim(),
    "€ 339.00",
    "The opening balance is correctly displayed"
  );
  assert.equal(
    findWithAssert("[data-test-month-balance-value]")
      .text()
      .trim(),
    "€ -25.00",
    "The month balance is the sum of transactions value"
  );
  assert.equal(
    findWithAssert("[data-test-current-balance-value]")
      .text()
      .trim(),
    "€ 314.00",
    "The current balance"
  );
});

//TODO: finish it
test("it sorts the transactions panels by desc date", async function(assert) {
  assert.expect(0);
  let monthDate = new Date(2017, 1, 1, 0, 0, 0, 0);

  let trsn1Date = new Date(monthDate.getTime());
  trsn1Date.setDate(25);
  let trsn2Date = new Date(monthDate.getTime());
  trsn2Date.setDate(18);
  let trsn3Date = new Date(monthDate.getTime());
  trsn3Date.setDate(27);
  let trsn4Date = new Date(monthDate.getTime());
  trsn4Date.setDate(23);

  let transactions = [
    await create("transaction", { date: trsn1Date }),
    await create("transaction", { date: trsn2Date }),
    await create("transaction", { date: trsn3Date }),
    await create("transaction", { date: trsn4Date })
  ];

  const month = await create("month", {
    openingBalance: 1,
    date: monthDate,
    transactions
  });

  transactions.forEach(async transaction => {
    await run(() => {
      transaction.set("month", month);
      return transaction.save();
    });
  });

  await visit(`/months/${month.get("id")}`);
});
