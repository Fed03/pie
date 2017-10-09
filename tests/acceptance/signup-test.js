import { test } from "qunit";
import { findWithAssert, visit, fillIn, click, find, currentRouteName, findAll, focus, blur } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { resetCouchDb } from "pie/tests/helpers/reset-couchdb";

moduleForPouchAcceptance("Acceptance | signup", {
  async beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
    await resetCouchDb(this.application);
  }
});

test("it shows inputs ", async function(assert) {
  await visit("/signup");

  assert.equal(findWithAssert("[data-test-username-input]").tagName, "input".toUpperCase());
  assert.equal(findWithAssert("[data-test-password-input]").tagName, "input".toUpperCase());
  assert.equal(findWithAssert("[data-test-initial-balance-input]").tagName, "input".toUpperCase());
});

test("the inputs are blank by default", async function(assert) {
  await visit("/signup");

  assert.equal(findWithAssert("[data-test-username-input]").value, "");
  assert.equal(findWithAssert("[data-test-password-input]").value, "");
  assert.equal(findWithAssert("[data-test-initial-balance-input]").value, "");
});

test("it creates a new user", async function(assert) {
  await visit("/signup");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-password-input]", "password");
  fillIn("[data-test-initial-balance-input]", 12368.53);

  await click("[data-test-create-user-btn]");

  let user = await this.store.findRecord("user", 1);

  assert.ok(user, "The user has been created");
  assert.equal(user.get("name"), "john", "The username is correctly saved");
  assert.equal(user.get("initialBalance"), 12368.53, "The initialBalance is correctly saved");
  assert.equal(user.get("currentBalance"), 12368.53, "The value of currentBalance is equal to initialBalance");
});

// test("the balance is formatted", async function(assert) {
//   await visit("/signup");
//
//   fillIn(testSelector("initial-balance-input"), 12368.53);
//   assert.equal(find(testSelector("initial-balance-input")).value, "12,368.53");
//
//   fillIn(testSelector("initial-balance-input"), 0);
//   assert.equal(find(testSelector("initial-balance-input")).value, "");
//
//   fillIn(testSelector("initial-balance-input"), "12.");
//   assert.equal(find(testSelector("initial-balance-input")).value, "12.");
// });

test("after user creation, redirects to /", async function(assert) {
  await visit("/signup");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-initial-balance-input]", 12368.53);
  await click("[data-test-create-user-btn]");

  assert.equal(currentRouteName(), "months.view");
});

test("the submit btn is disabled if any input is blank", async function(assert) {
  await visit("/signup");
  assert.ok(find("[data-test-create-user-btn]").disabled, "The button is disabled when all inputs are blank");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-password-input]", "password");
  assert.ok(find("[data-test-create-user-btn]").disabled, "The button is disabled when not every input is filled");

  fillIn("[data-test-initial-balance-input]", 12368.53);
  assert.notOk(find("[data-test-create-user-btn]").disabled, "The button is enabled");
});

test("it has validation", async function(assert) {
  await visit("/signup");
  assert.equal(findAll("[data-test-input-error]").length, 0, "No errors displayed");

  fillIn("[data-test-username-input]", "stro8921$");
  assert.equal(findAll('[data-test-input-error="username"]').length, 1, "Username input error");

  fillIn("[data-test-username-input]", "john");
  assert.equal(findAll('[data-test-input-error="username"]').length, 0);

  fillIn("[data-test-initial-balance-input]", "foo");
  assert.equal(findAll('[data-test-input-error="initial-balance"]').length, 1, "Initial balance input error");

  fillIn("[data-test-initial-balance-input]", 123.65);
  assert.equal(findAll('[data-test-input-error="initial-balance"]').length, 0);
});

test("it disables the submit btn if there are any validation errors", async function(assert) {
  await visit("/signup");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-initial-balance-input]", "foo");
  assert.ok(find("[data-test-create-user-btn]").disabled, "The button is disabled");

  fillIn("[data-test-initial-balance-input]", 123.65);
  assert.notOk(find("[data-test-create-user-btn]").disabled, "The button is enabled");
});

test("errors are displayed after blur", async function(assert) {
  await visit("/signup");
  assert.equal(findAll("[data-test-input-error]").length, 0, "No errors displayed");

  focus("[data-test-username-input]");
  blur("[data-test-username-input]");
  assert.ok(findAll('[data-test-input-error="username"]').length > 0, "Username input error");

  focus("[data-test-initial-balance-input]");
  blur("[data-test-initial-balance-input]");
  assert.ok(findAll('[data-test-input-error="initial-balance"]').length > 0, "Initial balance input error");
});
