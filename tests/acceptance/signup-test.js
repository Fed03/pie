import { test } from "qunit";
import testSelector from "ember-test-selectors";
import { findWithAssert, visit, fillIn, click } from "ember-native-dom-helpers";
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
