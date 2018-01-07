import { moduleFor, test } from "ember-qunit";
import { makeNew, manualSetup } from "ember-data-factory-guy";
import sinon from "sinon";

moduleFor("controller:transactions/create", "Unit | Controller | transactions.create", {
  integration: true,
  beforeEach() {
    manualSetup(this.container);
    this.inject.service("months-service", { as: "monthsServiceStub" });
    this.inject.service("store", { as: "storeStub" });
    this.inject.service("currentUser", { as: "currentUser" });
    this.currentUser.set("user", sinon.stub(makeNew("user")));
  }
});

test("it resets property to their default", function(assert) {
  let defaultCategory = makeNew("category", { name: "aaaaaa", type: "outcome" });
  let choseCat = makeNew("category", { name: "zz", type: "income" });
  let categories = [
    makeNew("category", { name: "c", type: "outcome" }),
    makeNew("category", { name: "b", type: "outcome" }),
    choseCat,
    defaultCategory,
    makeNew("category", { type: "income" })
  ];

  const subject = this.subject({ model: categories });
  subject.setProperties({
    transactionValue: 25,
    transactionDescription: "fooo",
    transactionDate: new Date(2018, 1, 3),
    transactionCategory: choseCat
  });

  subject.resetToDefaultProperties();

  assert.deepEqual(subject.get("transactionValue"), 0, "The transactionValue default is 0");
  assert.deepEqual(subject.get("transactionDescription"), null, "The transactionDescription default is null");
  assert.deepEqual(
    subject.get("transactionCategory"),
    defaultCategory,
    "The transactionCategory default is the first outcome category in alphabetical desc order"
  );
  // We check that the differnce between now and what has been set is less than 1000 milliseconds
  assert.ok(Math.abs(subject.get("transactionDate").getTime() - new Date().getTime()) < 1000, "The transactionDate default is now()");
});

test("actions: selectCategory sets the category and toggle a flag", function(assert) {
  let cat = makeNew("category");
  const subject = this.subject();
  const oldFlagValue = subject.get("isCatSelectorShowing");

  subject.actions.selectCategory.call(subject, cat);

  assert.equal(subject.get("isCatSelectorShowing"), !oldFlagValue);
  assert.deepEqual(subject.get("transactionCategory"), cat);
});

test("actions: createTransaction", async function(assert) {
  const month = makeNew("month");

  let cat = makeNew("category", { type: "income" });

  let date = new Date(2018, 1, 3);
  const expectedDate = new Date(date.getTime());
  expectedDate.setHours(0, 0, 0, 0);

  let transaction = makeNew("transaction");
  sinon.stub(transaction, "save").returns(transaction);

  sinon.stub(this.monthsServiceStub, "findMonthByDate").returns(month);
  const createRecordStub = sinon.stub(this.storeStub, "createRecord").returns(transaction);

  const subject = this.subject();
  sinon.stub(subject, "transitionToRoute");

  subject.setProperties({
    transactionValue: 25,
    transactionDescription: "foo",
    transactionDate: date,
    transactionCategory: cat
  });
  await subject.actions.createTransaction.call(subject);

  assert.ok(
    createRecordStub.calledWithExactly("transaction", {
      value: 25,
      description: "foo",
      date: expectedDate,
      category: cat,
      month
    })
  );
});
