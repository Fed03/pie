import { test, skip } from "qunit";
import selectCategory from "pie/tests/helpers/select-category";
import { calendarSelect, initCalendarHelpers } from "ember-power-calendar/test-support";
import getDateForCurrentMonth from "pie/utils/get-date-for-current-month";
import { fillCalcValue } from "pie/tests/helpers/fill-calc-value";
import { click, fillIn, find, visit, findWithAssert } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForPouchAcceptance("Acceptance | create transaction", {
  async beforeEach() {
    initCalendarHelpers(this.application.__container__);
    await create("user");
  }
});

test("it renders the right template", async function(assert) {
  assert.expect(0);
  await visit("/transactions/create");

  findWithAssert("[data-test-transaction-main-container]");
});

test("the selected category is the first in the outcome ordered set", async function(assert) {
  await createList("category", 2, { type: "income" });
  await create("category", { name: "foo", type: "outcome" });
  await create("category", { name: "bar", type: "outcome" });

  await visit("/transactions/create");

  assert.equal(findWithAssert("[data-test-selected-category-name]").textContent, "bar");
});

test("the fields are prefilled with default values", async function(assert) {
  const today = new Date().toLocaleDateString("en-US");
  await visit("/transactions/create");

  assert.ok(
    findWithAssert("[data-test-transaction-value]")
      .textContent.trim()
      .includes("0.00"),
    "Transaction value field is prefilled with 0"
  );
  assert.notOk(findWithAssert("[data-test-transaction-description]").value, "Transaction desc field is empty");
  assert.equal(
    findWithAssert(`${"[data-test-transaction-date]"} input`).value,
    today,
    "Transaction date field is prefilled with today date"
  );
});

test("it change the value field class according to the category type", async function(assert) {
  let outcomeCat = await create("category", { name: "foo", type: "outcome", id: 1 });
  let incomeCat = await create("category", { name: "bar", type: "income", id: 2 });

  await visit("/transactions/create");
  await selectCategory(outcomeCat);

  assert.ok(find("[data-test-transaction-value]").classList.contains("outcome-amount"), "Transaction value field has outcome-amount class");
  assert.notOk(
    find("[data-test-transaction-value]").classList.contains("income-amount"),
    "Transaction value field has not income-amount class"
  );

  await selectCategory(incomeCat);

  assert.ok(find("[data-test-transaction-value]").classList.contains("income-amount"), "Transaction value field has income-amount class");
  assert.notOk(
    find("[data-test-transaction-value]").classList.contains("outcome-amount"),
    "Transaction value field has not outcome-amount class"
  );
});

test("create transaction", async function(assert) {
  assert.expect(7);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let selectCat = await create("category", { name: "foo", type: "outcome" });
  await visit("/transactions/create");

  await click("[data-test-value-display]");
  await fillCalcValue("25");
  await click('[data-test-calc-key="equals"]');
  await fillIn("[data-test-transaction-description]", "An awesome book");
  await selectCategory(selectCat);

  await click("[data-test-submit-transaction]");

  assert.equal(currentRouteName(), "months.view");

  let transaction = await findLatestInDb("transaction");
  assert.equal(transaction.get("value"), -25, "The value is -25");
  assert.equal(transaction.get("description"), "An awesome book", 'The desc is "An awesome book"');
  assert.equal(transaction.get("date").getTime(), today.getTime(), "The transaction date is today without hours");

  let category = await transaction.get("category");
  assert.deepEqual(category, selectCat, "The transaction category is correct");

  let month = await transaction.get("month");
  assert.equal(month.get("date").getTime(), getDateForCurrentMonth().getTime(), "The transaction month is correct");
  assert.equal(month.get("transactions.length"), 1, "The month has the transaction");
});

test("Sign is added to the value field", async function(assert) {
  await create("category", { name: "foo", type: "outcome", id: 1 });
  let cat = await create("category", { name: "bar", type: "income", id: 2 });
  await visit("/transactions/create");

  assert.equal(find("[data-test-transaction-value] > span").textContent.trim(), "-0.00", "The value is set negative");

  await selectCategory(cat);
  assert.equal(find("[data-test-transaction-value] > span").textContent.trim(), "+0.00", "The value is set positive");

  await click("[data-test-value-display]");
  await fillCalcValue("12345");
  await click('[data-test-calc-key="equals"]');
  assert.equal(find("[data-test-transaction-value] > span").textContent.trim(), "+12,345.00", "The value is formatted");
});

// TODO: this must handles only app specific urls and respects ids
skip("it has a back link", async function(assert) {
  await visit("/transactions/create");
  await click("[data-test-go-back]");

  assert.equal(currentRouteName(), "months.view", "It has redirected to months.view");
});

test("it resets value on route exit", async function(assert) {
  let defaultCat = await create("category", { name: "foo", type: "outcome", id: 2 });
  let selectCat = await create("category", { name: "bar", type: "income", id: 3 });
  await visit("/transactions/create");

  await click("[data-test-value-display]");
  await fillCalcValue("12345");
  await click('[data-test-calc-key="equals"]');

  await fillIn("[data-test-transaction-description]", "An awesome book");

  await click("[data-test-date-picker-input]");
  await calendarSelect(".ember-power-calendar", new Date(2017, 6, 2));

  await selectCategory(selectCat);

  assert.equal(find("[data-test-value-display]").textContent.trim(), "+12,345.00");
  assert.equal(find(`${"[data-test-transaction-date]"} input`).value, new Date(2017, 6, 2).toLocaleDateString("en-US"));
  assert.equal(find("[data-test-selected-category-name]").textContent.trim(), "bar");

  await visit("/");
  await visit("/transactions/create");

  assert.equal(find("[data-test-value-display]").textContent.trim(), "-0.00", 'Value resetted to "0"');
  assert.equal(find("[data-test-transaction-description]").value, "", "Description resetted to empty string");
  assert.equal(find(`${"[data-test-transaction-date]"} input`).value, new Date().toLocaleDateString("en-US"), "Date resetted to today");
  assert.equal(find("[data-test-selected-category-name]").textContent.trim(), defaultCat.get("name"), "Category resetted to default one");
});
