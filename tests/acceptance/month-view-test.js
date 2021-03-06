import { run } from "@ember/runloop";
import moment from "moment";
import { test } from "qunit";
import { click, findAll, find, visit, findWithAssert } from "ember-native-dom-helpers";
import moduleForAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { authAndLoadUser } from "pie/tests/helpers/auth-and-load-user";

function getCurrentMonthName() {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const today = new Date();

  return months[today.getMonth()];
}

moduleForAcceptance("Acceptance | month view", {
  async beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
    this.currentUser = await authAndLoadUser(this.application);
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
    findWithAssert("[data-test-opening-balance-value]").textContent.trim(),
    "€ 342.58",
    "The opening balance is correctly displayed"
  );
  assert.equal(findWithAssert("[data-test-month-balance-value]").textContent.trim(), "€ 0.00", "The month balance is zero");
  assert.equal(findWithAssert("[data-test-current-balance-value]").textContent.trim(), "€ 342.58", "The current balance");
});

test("it creates current month if not present", async function(assert) {
  run.next(() => {
    this.currentUser.set("currentBalance", 1233.98);
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
    findWithAssert("[data-test-opening-balance-value]").textContent.trim(),
    "€ 1,233.98",
    "The opening balance is correctly displayed"
  );
  assert.equal(findWithAssert("[data-test-month-balance-value]").textContent.trim(), "€ 0.00", "The month balance is zero");
  assert.equal(findWithAssert("[data-test-current-balance-value]").textContent.trim(), "€ 1,233.98", "The current balance");
});

test("viewing a month without transaction will result in an empty page", async function(assert) {
  const currentMonth = await create("currentMonth");

  await visit(`/months/${currentMonth.get("id")}`);

  assert.ok(
    findWithAssert("[data-test-transactions-container]")
      .textContent.trim()
      .split(" ")
      .join(" "),
    "No transactions. Add (+) some!"
  );
  assert.equal(findAll("[data-test-transaction-item]").length, 0);
});

test("viewing a month will list its transactions", async function(assert) {
  assert.expect(3);
  const today = moment();
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
    findWithAssert("[data-test-opening-balance-value]").textContent.trim(),
    "€ 339.00",
    "The opening balance is correctly displayed"
  );
  assert.equal(
    findWithAssert("[data-test-month-balance-value]").textContent.trim(),
    "€ -25.00",
    "The month balance is the sum of transactions value"
  );
  assert.equal(findWithAssert("[data-test-current-balance-value]").textContent.trim(), "€ 314.00", "The current balance");
});

test("it sorts the transactions panels by desc date", async function(assert) {
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
  let panels = findAll("[data-test-transaction-panel-for-day]");

  assert.equal(panels.length, 4, "There are 4 panels");
  assert.equal(panels[0].getAttribute("data-test-transaction-panel-for-day"), 27);
  assert.equal(panels[1].getAttribute("data-test-transaction-panel-for-day"), 25);
  assert.equal(panels[2].getAttribute("data-test-transaction-panel-for-day"), 23);
  assert.equal(panels[3].getAttribute("data-test-transaction-panel-for-day"), 18);
});

test("Current month name and year is been displayed", async function(assert) {
  let march2015 = new Date(2015, 2, 1, 0, 0, 0, 0);
  let month = await create("month", { date: march2015 });

  await visit(`/months/${month.get("id")}`);

  let monthEl = findWithAssert("[data-test-month-selector]");
  assert.ok(monthEl.textContent.includes("March 2015"));
});

test("When prev month link is clicked then the page changes", async function(assert) {
  let march2015 = await create("month", { date: new Date(2015, 2, 1, 0, 0, 0, 0) });
  let february2015 = await create("month", { date: new Date(2015, 1, 1, 0, 0, 0, 0) });

  await visit(`/months/${march2015.get("id")}`);
  await click("[data-test-previous-month-btn]");

  assert.equal(currentURL(), `/months/${february2015.get("id")}`);
});

test("When next month link is clicked then the page changes", async function(assert) {
  let march2015 = await create("month", { date: new Date(2015, 2, 1, 0, 0, 0, 0) });
  let february2015 = await create("month", { date: new Date(2015, 1, 1, 0, 0, 0, 0) });

  await visit(`/months/${february2015.get("id")}`);
  await click("[data-test-next-month-btn]");

  assert.equal(currentURL(), `/months/${march2015.get("id")}`);
});
