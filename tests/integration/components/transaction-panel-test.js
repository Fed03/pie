import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { find, findAll } from "ember-native-dom-helpers";
import moment from "moment";
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
  this.set("transactions", A([]));
  this.render(hbs`{{transaction-panel date=date transactions=transactions}}`);

  assert.equal(findAll("div.transaction--panel.mui-panel").length, 1);
});

test("it renders the date", function(assert) {
  const today = new Date();
  this.set("date", today);
  this.set("transactions", A([]));
  this.render(hbs`{{transaction-panel date=date transactions=transactions}}`);

  assert.ok(
    stringContains(
      find('[data-test-panel-date]').textContent,
      moment().format("D dddd MMMM YYYY")
    )
  );
});

test("it prints the sum of transactions", function(assert) {
  this.set("date", new Date());
  this.set("transactions", [
    make("transaction", { value: 5.2 }),
    make("transaction", { value: -3.1 }),
    make("transaction", { value: 0.4 })
  ]);
  this.render(hbs`{{transaction-panel transactions=transactions date=date}}`);

  assert.equal(
    find('[data-test-panel-balance]').textContent.trim(),
    "€ +2.50"
  );
});

test("it sets a class according to the total balance", function(assert) {
  const transaction1 = make("transaction", { value: 5.2 });
  const transaction2 = make("transaction", { value: 5.2 });
  this.set("transactions", [transaction1, transaction2]);
  this.set("date", new Date());
  this.render(hbs`{{transaction-panel transactions=transactions date=date}}`);

  assert.ok(
    find('[data-test-panel-balance]').classList.contains("income-amount"),
    'It has the ".income-amount" class'
  );
  assert.notOk(
    find('[data-test-panel-balance]').classList.contains("outcome-amount"),
    'It has not the ".outcome-amount" class'
  );

  run(() => {
    transaction2.set("value", -5.2);
  });
  assert.notOk(
    find('[data-test-panel-balance]').classList.contains("income-amount"),
    'It has not the ".income-amount" class'
  );
  assert.notOk(
    find('[data-test-panel-balance]').classList.contains("outcome-amount"),
    'It has not the ".outcome-amount" class'
  );

  run(() => {
    transaction2.set("value", -8.2);
  });
  assert.notOk(
    find('[data-test-panel-balance]').classList.contains("income-amount"),
    'It has not the ".income-amount" class'
  );
  assert.ok(
    find('[data-test-panel-balance]').classList.contains("outcome-amount"),
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
  this.set("date", new Date());
  this.render(hbs`{{transaction-panel transactions=transactions date=date}}`);

  assert.equal(
    findAll('[data-test-transaction-item]').length,
    3,
    "It contains 3 transactions"
  );

  const firstTransactionEl = this.$('[data-test-transaction-item]').first();
  assert.ok(
    firstTransactionEl
      .find('[data-test-category-badge]')
      .hasClass("category--badge-income"),
    "It sets the class on the category badge"
  );
  assert.ok(
    stringContains(
      firstTransactionEl
        .find('[data-test-transaction-description]')
        .text()
        .trim(),
      "Coffee Food"
    ),
    "It shows the transaction description"
  );
  assert.equal(
    firstTransactionEl.find('[data-test-transaction-amount]').text().trim(),
    "€ +5.20",
    "it shows the transaction amount"
  );

  assert.ok(
    firstTransactionEl
      .find('[data-test-transaction-amount]')
      .hasClass("income-amount"),
    "It sets the `income` class for transaction"
  );
  run(() => {
    firstTransaction.set("value", -4);
  });
  assert.ok(
    firstTransactionEl
      .find('[data-test-transaction-amount]')
      .hasClass("outcome-amount"),
    "It sets the `outcome` class for transaction"
  );
});
