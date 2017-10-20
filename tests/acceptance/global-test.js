import { test } from "qunit";
import { findWithAssert, visit } from "ember-native-dom-helpers";
import moduleForAcceptance from "pie/tests/helpers/module-for-pouch-acceptance";
import { authAndLoadUser } from "pie/tests/helpers/auth-and-load-user";

moduleForAcceptance("Acceptance | global", {
  beforeEach() {
    return authAndLoadUser(this.application, {
      currentBalance: 1000.98
    });
  }
});

test("it displays the currentBalance", async function(assert) {
  await visit("/");
  assert.equal(findWithAssert("[data-test-user-balance]").textContent.trim(), "€ 1,000.98", "The balance is displayed and formatted");
});
