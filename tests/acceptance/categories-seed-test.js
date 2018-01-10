import { test } from "qunit";
import { visit } from "ember-native-dom-helpers";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { authAndLoadUser } from "pie/tests/helpers/auth-and-load-user";

moduleForPouchAcceptance("Acceptance | categories seed", {
  beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
  }
});

test("when already authenticated, it seeds the categories", async function(assert) {
  await authAndLoadUser(this.application);
  // let categories = await this.store.findAll("category");
  // assert.equal(categories.get("length"), 0, "There are no categories in store");

  await visit("/");
  let categories = await this.store.findAll("category");
  assert.ok(categories.get("length") > 0, "There are few categories seeded");
});

test("when not authenticated, it does not seed the categories", async function(assert) {
  await visit("/");
  let categories = await this.store.findAll("category");
  assert.equal(categories.get("length"), 0, "There are few categories seeded");
});

test("when gets authenticated, it seeds the categories", async function(assert) {
  await visit("/");
  let categories = await this.store.findAll("category");
  assert.equal(categories.get("length"), 0, "There are no categories in store");

  await authAndLoadUser(this.application);

  categories = await this.store.findAll("category");
  assert.ok(categories.get("length") > 0, "There are few categories seeded");
});
