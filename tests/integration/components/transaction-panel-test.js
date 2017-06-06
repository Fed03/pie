import Ember from "ember";
import hbs from "htmlbars-inline-precompile";
import { currency } from "accounting/settings";
import { moduleForComponent, test } from "ember-qunit";
import { make, manualSetup } from "ember-data-factory-guy";

const stringContains = function(string, containing) {
  containing = containing.split(" ").join("\\s+");
  return new RegExp(containing).test(string);
};

moduleForComponent(
  "transaction-panel",
  "Integration | Component | transaction panel",
  {
    integration: true,
    beforeEach() {
      currency.symbol = "€";
      currency.format = {
        pos: "%s +%v",
        neg: "%s -%v",
        zero: "%s %v"
      };
      manualSetup(this.container);
    }
  }
);

test("it renders with the correct attrs", function(assert) {
  const today = new Date();
  this.set("date", today);
  this.set("transactions", Ember.A([]));
  this.render(hbs`{{transaction-panel date=date transactions=transactions}}`);

  assert.equal(this.$("div.transaction--panel.mui-panel").length, 1);
  assert.ok(
    this.$("div.transaction--panel.mui-panel").is(
      `[data-test-selector=${today.getUTCDate()}-day]`
    )
  );
});

test("it renders the date", function(assert) {
  const today = new Date();
  this.set("date", today);
  this.set("transactions", Ember.A([]));
  this.render(hbs`{{transaction-panel date=date transactions=transactions}}`);

  assert.ok(
    stringContains(
      this.$(".transaction--list-date").text(),
      moment().format("D dddd MMMM YYYY")
    )
  );
});

test("it prints the sum of transactions", function(assert) {
  this.set("transactions", [
    make("transaction", { value: 5.2 }),
    make("transaction", { value: -3.1 }),
    make("transaction", { value: 0.4 })
  ]);
  this.render(hbs`{{transaction-panel transactions=transactions}}`);

  assert.equal(
    this.$(".transaction--list-total-balance").text().trim(),
    "€ +2.50"
  );
});

test("it sets a class according to the total balance", function(assert) {
  const transaction1 = make("transaction", { value: 5.2 });
  const transaction2 = make("transaction", { value: 5.2 });
  this.set("transactions", [transaction1, transaction2]);
  this.render(hbs`{{transaction-panel transactions=transactions}}`);

  assert.ok(
    this.$(".transaction--list-total-balance").hasClass("income-amount"),
    'It has the ".income-amount" class'
  );
  assert.notOk(
    this.$(".transaction--list-total-balance").hasClass("outcome-amount"),
    'It has not the ".outcome-amount" class'
  );

  Ember.run(() => {
    transaction2.set("value", -5.2);
  });
  assert.notOk(
    this.$(".transaction--list-total-balance").hasClass("income-amount"),
    'It has not the ".income-amount" class'
  );
  assert.notOk(
    this.$(".transaction--list-total-balance").hasClass("outcome-amount"),
    'It has not the ".outcome-amount" class'
  );

  Ember.run(() => {
    transaction2.set("value", -8.2);
  });
  assert.notOk(
    this.$(".transaction--list-total-balance").hasClass("income-amount"),
    'It has not the ".income-amount" class'
  );
  assert.ok(
    this.$(".transaction--list-total-balance").hasClass("outcome-amount"),
    'It has the ".outcome-amount" class'
  );
});

test("it renders the transactions", function(assert) {
  const category = make("category", { type: "income", name: "Food" });
  const firstTransaction = make("transaction", {
    value: 5.2,
    category: category,
    description: "Coffee"
  });
  this.set("transactions", [
    firstTransaction,
    make("transaction", { value: -3.1 }),
    make("transaction", { value: 0.4 })
  ]);
  this.render(hbs`{{transaction-panel transactions=transactions}}`);

  assert.equal(this.$(".transaction--list-item").length, 3);

  const firstTransactionEl = this.$(".transaction--list-item").first();
  assert.ok(
    firstTransactionEl
      .find(".category--badge")
      .hasClass("category--badge-income")
  );
  assert.ok(
    stringContains(
      firstTransactionEl
        .find(".transaction--list-item-description")
        .text()
        .trim(),
      "Coffee Food"
    )
  );
  assert.equal(
    firstTransactionEl.find(".transaction--list-item-balance").text().trim(),
    "€ +5.20"
  );

  assert.ok(
    firstTransactionEl
      .find(".transaction--list-item-balance")
      .hasClass("income-amount")
  );
  Ember.run(() => {
    firstTransaction.set("value", -4);
  });
  assert.ok(
    firstTransactionEl
      .find(".transaction--list-item-balance")
      .hasClass("outcome-amount")
  );
});
