import {
  click,
  fillIn,
  find,
  visit,
  findWithAssert
} from "ember-native-dom-helpers";
import moment from "moment";
import { test } from "qunit";
import testSelector from "ember-test-selectors";
import getDateForCurrentMonth from "pie/utils/get-date-for-current-month";
import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForPouchAcceptance("Acceptance | create transaction");

test("it requires authentication", async function(assert) {
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "login");

  await authenticateSession(this.application);
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "transactions.create");
});

test("it renders the right template", async function(assert) {
  assert.expect(0);
  await authenticateSession(this.application);
  await visit("/transactions/create");

  findWithAssert(testSelector("transaction-main-container"));
});

test("the selected category is the first in the outcome ordered set", async function(
  assert
) {
  await createList("category", 2, { type: "income" });
  await create("category", { name: "foo", type: "outcome" });
  await create("category", { name: "bar", type: "outcome" });
  await authenticateSession(this.application);

  await visit("/transactions/create");

  assert.equal(
    findWithAssert(testSelector("selected-category-name")).textContent,
    "bar"
  );
});

test("the fields are prefilled with default values", async function(assert) {
  const today = moment().format("D/M/YYYY");
  await authenticateSession(this.application);
  await visit("/transactions/create");

  assert.ok(
    findWithAssert(testSelector("transaction-value")).textContent
      .trim()
      .includes("0.00"),
    "Transaction value field is prefilled with 0"
  );
  assert.notOk(
    findWithAssert(testSelector("transaction-description")).value,
    "Transaction desc field is empty"
  );
  assert.equal(
    findWithAssert(testSelector("transaction-date")).value,
    today,
    "Transaction date field is prefilled with today date"
  );
});

test("it change the value field class according to the category type", async function(
  assert
) {
  await create("category", { name: "foo", type: "outcome", id: 1 });
  await create("category", { name: "bar", type: "income", id: 2 });
  await authenticateSession(this.application);

  await visit("/transactions/create");
  await click(testSelector("transaction-category"));
  await click(testSelector("category-list-item", "1-foo"));

  assert.ok(
    find(testSelector("transaction-value")).classList.contains(
      "outcome-amount"
    ),
    "Transaction value field has outcome-amount class"
  );
  assert.notOk(
    find(testSelector("transaction-value")).classList.contains("income-amount"),
    "Transaction value field has not income-amount class"
  );

  await click(testSelector("transaction-category"));
  await click(testSelector("category-list-item", "2-bar"));

  assert.ok(
    find(testSelector("transaction-value")).classList.contains("income-amount"),
    "Transaction value field has income-amount class"
  );
  assert.notOk(
    find(testSelector("transaction-value")).classList.contains(
      "outcome-amount"
    ),
    "Transaction value field has not outcome-amount class"
  );
});

test("create transaction", async function(assert) {
  assert.expect(8);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await create("category", { name: "foo", type: "outcome" });
  await authenticateSession(this.application);
  await visit("/transactions/create");

  await fillTransactionValue(25);
  await fillIn('[name="transaction-description"]', "An awesome book");
  await click('.list-item[data-category$="-foo"]');
  await click("[data-test-selector=submit-transaction]");

  assert.equal(currentRouteName(), "months.view");
  assert.ok(
    find(".transaction--list-item-description").textContent.includes(
      "An awesome book"
    )
  );

  let transaction = await findLatestInDb("transaction");
  assert.equal(transaction.get("value"), -25, "The value is -25");
  assert.equal(
    transaction.get("description"),
    "An awesome book",
    'The desc is "An awesome book"'
  );
  assert.equal(
    transaction.get("date").getTime(),
    today.getTime(),
    "The transaction date is today without hours"
  );

  let category = await transaction.get("category");
  assert.equal(
    category.get("name"),
    "foo",
    'The transaction category name is "foo"'
  );

  let month = await transaction.get("month");
  assert.equal(
    month.get("date").getTime(),
    getDateForCurrentMonth().getTime(),
    "The transaction month is correct"
  );
  assert.equal(month.get("transactions.length"), 1, "It has the transaction");
});

test("Sign is added to the value field", async function(assert) {
  await create("category", { name: "foo", type: "outcome", id: 1 });
  await create("category", { name: "bar", type: "income", id: 2 });
  await authenticateSession(this.application);
  await visit("/transactions/create");

  assert.equal(
    find(testSelector("transaction-value")).textContent.trim(),
    "-0.00",
    "The value is set negative"
  );

  await click(testSelector("category-list-item", "2-bar"));
  assert.equal(
    find(testSelector("transaction-value")).textContent.trim(),
    "+0.00",
    "The value is set positive"
  );

  await fillTransactionValue(12345);
  assert.equal(
    find(testSelector("transaction-value")).textContent.trim(),
    "+12,345.00",
    "The value is formatted"
  );
});

test("it has a back link", async function(assert) {
  await visit("/transactions/create");
  await authenticateSession(this.application);
  await click(testSelector("go-back"));

  assert.equal(
    currentRouteName(),
    "months.view",
    "It has redirected to months.view"
  );
});

test("it resets value on route exit", async function(assert) {
  await create("category", { name: "foo", type: "outcome" });
  await authenticateSession(this.application);
  await visit("/transactions/create");

  await fillTransactionValue(25);
  await fillIn('[name="transaction-description"]', "An awesome book");
  await fillIn(
    '[name="transaction-date"]',
    moment().subtract(7, "days").format("D/M/YYYY")
  );
  await click(".back-link");
  await visit("/transactions/create");

  const today = moment().format("D/M/YYYY");
  assert.equal(
    find("[data-test-selector=transaction-value]").textContent.trim(),
    "-0.00",
    'Value resetted to "0"'
  );
  assert.equal(
    find('[name="transaction-description"]').value,
    "",
    "Description resetted to empty string"
  );
  assert.equal(
    find('[name="transaction-date"]').value,
    today,
    "Date resetted to today"
  );
});
