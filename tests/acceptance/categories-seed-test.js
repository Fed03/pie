import { test } from "qunit";
import { visit } from "ember-native-dom-helpers";
import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";
import moduleForPouchAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForPouchAcceptance("Acceptance | categories seed", {
  beforeEach() {
    this.store = this.application.__container__.lookup("service:store");
  }
});

test("it seeds default categories", async function(assert) {
  authenticateSession(this.application);

  let categories = await this.store.findAll("category");
  assert.equal(categories.get("length"), 0, "There are no categories in store");

  await visit("/");
  categories = await this.store.findAll("category");
  assert.ok(categories.length > 0, "There are few categories seeded");
});
