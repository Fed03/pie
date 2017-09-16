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

  // const currentMonth = await create("currentMonth");
  // await createList("transaction", 2, { month: currentMonth });
  // await create("transaction", "yesterday", { month: currentMonth });
  // await create("transaction", "yesterday", { month: currentMonth });
  // await create("transaction", "yesterday", { month: currentMonth });
  //
  // currentMonth.get("transactions").pushObjects(this.store.peekAll("transaction"));
  // await currentMonth.save();

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
  // const currentMonth = await create("currentMonth");
  //
  // await create("transaction", { value: 5, month: currentMonth });
  // await create("transaction", { value: -60, month: currentMonth });
  // await createList("transaction", 3, { value: 10, month: currentMonth });
  //
  // await run(() => {
  //   currentMonth.set("openingBalance", 339);
  //   currentMonth.get("transactions").pushObjects(this.store.peekAll("transaction"));
  //   return currentMonth.save();
  // });

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
