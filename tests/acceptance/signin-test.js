import { test } from "qunit";
import { findWithAssert, visit, fillIn, click, find, currentRouteName, findAll, focus, blur } from "ember-native-dom-helpers";
import { resetCouchDb, registerUser, initCouchDB } from "pie/tests/helpers/couchdb-utils";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { currentSession, invalidateSession } from "pie/tests/helpers/ember-simple-auth";

// TODO: password validation
moduleForPouchAcceptance("Acceptance | signin form");

test("it shows inputs", async function(assert) {
  await visit("/signin");

  assert.equal(findWithAssert("[data-test-username-input]").tagName, "input".toUpperCase());
  assert.equal(findWithAssert("[data-test-password-input]").tagName, "input".toUpperCase());
});

test("the inputs are blank by default", async function(assert) {
  await visit("/signin");

  assert.equal(findWithAssert("[data-test-username-input]").value, "");
  assert.equal(findWithAssert("[data-test-password-input]").value, "");
});

test("the submit btn is disabled if any input is blank", async function(assert) {
  await visit("/signin");
  assert.ok(findWithAssert("[data-test-signin-btn]").disabled, "The button is disabled when all inputs are blank");

  fillIn("[data-test-username-input]", "john");
  assert.ok(find("[data-test-signin-btn]").disabled, "The button is disabled when not every input is filled");

  fillIn("[data-test-password-input]", "password");
  assert.notOk(find("[data-test-signin-btn]").disabled, "The button is enabled");
});

test("it has validation", async function(assert) {
  await visit("/signin");
  assert.equal(findAll("[data-test-input-error]").length, 0, "No errors displayed");

  fillIn("[data-test-username-input]", "stro8921$");
  assert.equal(findAll('[data-test-input-error="username"]').length, 1, "Username input error");

  fillIn("[data-test-username-input]", "john");
  assert.equal(findAll('[data-test-input-error="username"]').length, 0);
});

test("it disables the submit btn if there are any validation errors", async function(assert) {
  await visit("/signin");

  fillIn("[data-test-password-input]", "password");
  fillIn("[data-test-username-input]", "stro8921$");
  assert.ok(find("[data-test-signin-btn]").disabled, "The button is disabled");

  fillIn("[data-test-username-input]", "john");
  assert.notOk(find("[data-test-signin-btn]").disabled, "The button is enabled");
});

test("errors are displayed after blur", async function(assert) {
  await visit("/signin");
  assert.equal(findAll("[data-test-input-error]").length, 0, "No errors displayed");

  focus("[data-test-username-input]");
  blur("[data-test-username-input]");
  assert.ok(findAll('[data-test-input-error="username"]').length > 0, "Username input error");
});

test("it has a link to signup page", async function(assert) {
  await visit("/signin");
  await click("[data-test-signup-link]");

  assert.equal(currentRouteName(), "signup");
});

moduleForPouchAcceptance("Acceptance | signin process", {
  async beforeEach() {
    initCouchDB(this.application);
    invalidateSession(this.application);
    await resetCouchDb();
  }
});

test("it logs the user in", async function(assert) {
  await registerUser("john", "password");
  await visit("/signin");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-password-input]", "password");
  await click("[data-test-signin-btn]");

  const session = currentSession(this.application);
  assert.ok(session.get("isAuthenticated"), "The session is authenticated");
});

test("it prevents log in if there are validation errors", async function(assert) {
  await registerUser("stro8921$", "password");
  await visit("/signin");

  fillIn("[data-test-username-input]", "stro8921$");
  fillIn("[data-test-password-input]", "password");
  find("[data-test-signin-btn]").removeAttribute("disabled");
  await click("[data-test-signin-btn]");

  const session = currentSession(this.application);
  assert.notOk(session.get("isAuthenticated"), "The session is not authenticated");
});

test("it displays an error if the user does not exist", async function(assert) {
  await visit("/signin");

  assert.notOk(find("[data-test-login-error]"));

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-password-input]", "password");
  await click("[data-test-signin-btn]");

  assert.ok(find("[data-test-login-error]"));
});

test("it redirects when the user logs in", async function(assert) {
  await registerUser("john", "password");
  await visit("/signin");

  fillIn("[data-test-username-input]", "john");
  fillIn("[data-test-password-input]", "password");
  await click("[data-test-signin-btn]");

  assert.equal(currentRouteName(), "months.view");
});
