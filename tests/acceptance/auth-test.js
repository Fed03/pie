import { test } from "qunit";
import { visit } from "ember-native-dom-helpers";
import { run } from "@ember/runloop";
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

test("it loads the auth user when logged in", async function(assert) {
  const store = this.application.__container__.lookup("service:store");
  await create("user", { id: "foo" });
  run(() => {
    store.unloadAll();
  });

  await visit("/");
  await authenticateSession(this.application, { baseUserId: "foo" });

  const authUser = store.peekRecord("user", "foo");
  assert.ok(authUser, "The user has been loaded into the store");
  assert.equal(authUser.get("id"), "foo", "The loaded user has the id stated in `baseUserId`");
});

test("it loads the auth user when already logged in", async function(assert) {
  const store = this.application.__container__.lookup("service:store");
  await create("user", { id: "foo" });
  run(() => {
    store.unloadAll();
  });
  await create("currentMonth");
  await authenticateSession(this.application, { baseUserId: "foo" });
  await visit("/");

  const authUser = store.peekRecord("user", "foo");
  assert.ok(authUser, "The user has been loaded into the store");
  assert.equal(authUser.get("id"), "foo", "The loaded user has the id stated in `baseUserId`");
});
