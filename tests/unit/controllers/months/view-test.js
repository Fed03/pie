import EmberObject from '@ember/object';
import { moduleFor, test } from "ember-qunit";
import { make, manualSetup } from "ember-data-factory-guy";

moduleFor("controller:months/view", "Unit | Controller | months.view", {
  // Specify the other units that are required for this test.
  needs: ["model:transaction", "model:month", "model:category"],
  beforeEach() {
    manualSetup(this.container);
  }
});

test("it computes transactions balance", function(assert) {
  const trns1 = make("transaction", { value: 60 });
  const trns2 = make("transaction", { value: -31.25 });
  const month = make("month", {
    transactions: [trns1, trns2],
    openingBalance: 100
  });
  let controller = this.subject({ model: month });

  assert.equal(
    controller.get("currentBalance"),
    128.75,
    "currentBalance is the sum of transactions value"
  );
});

test("it groups transactions by date", function(assert) {
  const today1 = new Date();
  today1.setHours(0, 0, 0, 0);

  const today2 = new Date();
  today2.setHours(0, 0, 0, 0);

  const randomDate = new Date(2017, 1, 1);
  randomDate.setHours(0, 0, 0, 0);

  const trns1 = EmberObject.create({ date: today1 });
  const trns2 = EmberObject.create({ date: today2 });
  const trns3 = EmberObject.create({ date: randomDate });
  const month = EmberObject.create({ transactions: [trns1, trns2, trns3] });

  let transactionsByDate = this.subject({ model: month }).get(
    "transactionsByDate"
  );

  assert.equal(transactionsByDate.length, 2, "Array has 2 groups");
  assert.deepEqual(transactionsByDate.findBy("value", today1).items, [
    trns1,
    trns2
  ]);
  assert.deepEqual(transactionsByDate.findBy("value", randomDate).items, [
    trns3
  ]);
});
