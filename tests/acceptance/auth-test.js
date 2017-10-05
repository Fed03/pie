import { test } from "qunit";
import { visit } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";

moduleForPouchAcceptance("Acceptance | auth");

test("visiting / while not authenticated redirects to /signup", async function(assert) {
  await visit("/");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /months/:id while not authenticated redirects to /signup", async function(assert) {
  await visit("/months/1");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /transactions/create while not authenticated redirects to /signup", async function(assert) {
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "signup");
});

test("visiting / while authenticated doesn't trigger a redirect", async function(assert) {
  authenticateSession(this.application);
  await create("currentMonth");
  await visit("/");
  assert.equal(currentRouteName(), "months.view");
});

test("visiting /months/:id while authenticated doesn't trigger a redirect", async function(assert) {
  authenticateSession(this.application);
  await create("month", { id: 1 });
  await visit("/months/1");
  assert.equal(currentRouteName(), "months.view");
});

test("visiting /transactions/create while authenticated doesn't trigger a redirect", async function(assert) {
  authenticateSession(this.application);
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "transactions.create");
});

test("visiting /signup while not authenticated doesn't trigger a redirect", async function(assert) {
  await visit("/signup");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /signup while authenticated redirects to /", async function(assert) {
  authenticateSession(this.application);
  await create("currentMonth");
  await visit("/signup");
  assert.equal(currentRouteName(), "months.view");
});
