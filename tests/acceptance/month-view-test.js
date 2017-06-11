import { test } from "qunit";
import testSelector from "ember-test-selectors";
import { click, findAll, find, visit } from "ember-native-dom-helpers";
import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";
import moduleForAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

function getCurrentMonthName() {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ];
  const today = new Date();

  return months[today.getUTCMonth()];
}

moduleForAcceptance("Acceptance | month view", {
  beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
  }
});

test("visiting `/` redirects to the current month", async function(assert) {
  authenticateSession(this.application);
  const currentMonth = await create("currentMonth");

  await visit("/");

  assert.equal(currentRouteName(), "months.view");
  assert.equal(currentURL(), `/months/${currentMonth.get("id")}`);
  assert.ok(
    find(testSelector("month-name")).textContent
      .trim()
      .toLowerCase()
      .includes(getCurrentMonthName()),
    "The page shows the current month name"
  );
});

test("viewing a month without transaction will result in an empty page", async function(
  assert
) {
  authenticateSession(this.application);
  const currentMonth = await create("currentMonth");

  await visit(`/months/${currentMonth.get("id")}`);

  assert.ok(
    findWithAssert(testSelector("transactions-container"))
      .text()
      .trim()
      .split(" ")
      .join(" "),
    "No transactions. Add (+) some!"
  );
  assert.equal(findAll(testSelector("transaction-item")).length, 0);
});

test("viewing a month will list its transactions", async function(assert) {
  assert.expect(3);
  authenticateSession(this.application);
  const currentMonth = await create("currentMonth");
  const todayDate = new Date().getUTCDate();

  await createList("transaction", 2, { month: currentMonth });
  await create("transaction", "yesterday", { month: currentMonth });
  await create("transaction", "yesterday", { month: currentMonth });
  await create("transaction", "yesterday", { month: currentMonth });

  currentMonth
    .get("transactions")
    .pushObjects(this.store.peekAll("transaction"));
  await currentMonth.save();

  await visit(`/months/${currentMonth.get("id")}`);
  assert.equal(
    findAll(testSelector("transaction-panel-for-day")).length,
    2,
    "The month has 2 days with transactions"
  );
  assert.equal(
    find(testSelector("transaction-panel-for-day", todayDate)).querySelectorAll(
      testSelector("transaction-item")
    ).length,
    2,
    "Today panel has 2 transactions"
  );
  assert.equal(
    find(
      //BUG: today - 1
      testSelector("transaction-panel-for-day", todayDate - 1)
    ).querySelectorAll(testSelector("transaction-item")).length,
    3,
    "Yesterday panel has 3 transactions"
  );
});

test("clicking on the add button redirects to transaction.create", async function(
  assert
) {
  assert.expect(1);
  authenticateSession(this.application);
  const currentMonth = await create("currentMonth");

  await visit(`/months/${currentMonth.get("id")}`);
  await click(testSelector("new-transaction-btn"));

  assert.equal(currentRouteName(), "transactions.create");
});

test("it computes the total balance", async function(assert) {
  authenticateSession(this.application);
  const currentMonth = await create("currentMonth");

  await create("transaction", { value: 5, month: currentMonth });
  await create("transaction", { value: -60, month: currentMonth });
  await createList("transaction", 3, { value: 10, month: currentMonth });

  currentMonth
    .get("transactions")
    .pushObjects(this.store.peekAll("transaction"));
  currentMonth.set("openingBalance", 339);
  await currentMonth.save();

  await visit(`/months/${currentMonth.get("id")}`);
  assert.equal(
    findWithAssert(testSelector("opening-balance-value")).text().trim(),
    "€ 339.00",
    "The opening balance is correctly displayed"
  );
  assert.equal(
    findWithAssert(testSelector("month-balance-value")).text().trim(),
    "€ -25.00",
    "The month balance is the sum of transactions value"
  );
  assert.equal(
    findWithAssert(testSelector("current-balance-value")).text().trim(),
    "€ 314.00",
    "The current balance"
  );
});
