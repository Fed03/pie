import { test } from "qunit";
import { run } from "@ember/runloop";
import { findWithAssert, visit } from "ember-native-dom-helpers";
import moduleForAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";

moduleForAcceptance("Acceptance | global", {
  async beforeEach() {
    this.currentUser = await create("user");
  }
});

test("it displays the currentBalance", async function(assert) {
  await run(() => {
    this.currentUser.set("currentBalance", 1000.98);
    return this.currentUser.save();
  });

  await visit("/");
  assert.equal(findWithAssert("[data-test-user-balance]").textContent.trim(), "€ 1,000.98", "The balance is displayed and formatted");
});
