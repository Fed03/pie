import { test } from "qunit";
import testSelector from "ember-test-selectors";
import { findWithAssert, visit, fillIn, click, find, currentRouteName, findAll, focus, blur } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForPouchAcceptance("Acceptance | signup", {
  beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
  }
});

test("it shows inputs for name and initial balance", async function(assert) {
  await visit("/signup");

  assert.equal(findWithAssert(testSelector("username-input")).tagName, "input".toUpperCase());
  assert.equal(findWithAssert(testSelector("initial-balance-input")).tagName, "input".toUpperCase());
});

test("the inputs are black by default", async function(assert) {
  await visit("/signup");

  assert.equal(findWithAssert(testSelector("username-input")).value, "");
  assert.equal(findWithAssert(testSelector("initial-balance-input")).value, "");
});

test("it create a new user", async function(assert) {
  await visit("/signup");

  fillIn(testSelector("username-input"), "john");
  fillIn(testSelector("initial-balance-input"), 12368.53);
  await click(testSelector("create-user-btn"));

  let user = await this.store.findAll("user").then(users => users.get("firstObject"));

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

  fillIn(testSelector("username-input"), "john");
  fillIn(testSelector("initial-balance-input"), 12368.53);
  await click(testSelector("create-user-btn"));

  assert.equal(currentRouteName(), "months.view");
});

test("the submit btn is disabled if any input is blank", async function(assert) {
  await visit("/signup");
  assert.ok(find(testSelector("create-user-btn")).disabled, "The button is disabled when all inputs are blank");

  fillIn(testSelector("username-input"), "john");
  assert.ok(find(testSelector("create-user-btn")).disabled, "The button is disabled when only one input is filled");

  fillIn(testSelector("initial-balance-input"), 12368.53);
  assert.notOk(find(testSelector("create-user-btn")).disabled, "The button is enabled");
});

test("it has validation", async function(assert) {
  await visit("/signup");
  assert.equal(findAll(testSelector("input-error")).length, 0, "No errors displayed");

  fillIn(testSelector("username-input"), "stro8921$");
  assert.equal(findAll(testSelector("input-error", "username")).length, 1, "Username input error");

  fillIn(testSelector("username-input"), "john");
  assert.equal(findAll(testSelector("input-error", "username")).length, 0);

  fillIn(testSelector("initial-balance-input"), "foo");
  assert.equal(findAll(testSelector("input-error", "initial-balance")).length, 1, "Initial balance input error");

  fillIn(testSelector("initial-balance-input"), 123.65);
  assert.equal(findAll(testSelector("input-error", "initial-balance")).length, 0);
});

test("it disables the submit btn if there are any validation errors", async function(assert) {
  await visit("/signup");

  fillIn(testSelector("username-input"), "john");
  fillIn(testSelector("initial-balance-input"), "foo");
  assert.ok(find(testSelector("create-user-btn")).disabled, "The button is disabled");

  fillIn(testSelector("initial-balance-input"), 123.65);
  assert.notOk(find(testSelector("create-user-btn")).disabled, "The button is enabled");
});

test("errors are displayed after blur", async function(assert) {
  await visit("/signup");
  assert.equal(findAll(testSelector("input-error")).length, 0, "No errors displayed");

  focus(testSelector("username-input"));
  blur(testSelector("username-input"));
  assert.ok(findAll(testSelector("input-error", "username")).length > 0, "Username input error");

  focus(testSelector("initial-balance-input"));
  blur(testSelector("initial-balance-input"));
  assert.ok(findAll(testSelector("input-error", "initial-balance")).length > 0, "Initial balance input error");
});
