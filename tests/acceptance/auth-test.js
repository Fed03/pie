import { test } from "qunit";
import { visit } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForPouchAcceptance("Acceptance | auth");

test("visiting / without a user redirects to /signup", async function(assert) {
  await visit("/");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /months/:id without a user redirects to /signup", async function(assert) {
  await visit("/months/1");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /transactions/create without a user redirects to /signup", async function(assert) {
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "signup");
});

test("visiting / with a user doesn't trigger a redirect", async function(assert) {
  await create("user");
  await visit("/");
  assert.equal(currentRouteName(), "months.view");
});

test("visiting /months/:id with a user doesn't trigger a redirect", async function(assert) {
  await create("user");
  await create("month", { id: 1 });
  await visit("/months/1");
  assert.equal(currentRouteName(), "months.view");
});

test("visiting /transactions/create with a user doesn't trigger a redirect", async function(assert) {
  await create("user");
  await visit("/transactions/create");
  assert.equal(currentRouteName(), "transactions.create");
});

test("visiting /signup without a user doesn't trigger a redirect", async function(assert) {
  await visit("/signup");
  assert.equal(currentRouteName(), "signup");
});

test("visiting /signup with a user redirects to /", async function(assert) {
  await create("user");
  await visit("/signup");
  assert.equal(currentRouteName(), "months.view");
});
