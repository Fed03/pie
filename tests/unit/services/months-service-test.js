import { moduleFor } from "ember-qunit";
import Service from "@ember/service";
import test from "ember-sinon-qunit/test-support/test";
import { A as emberArray } from "@ember/array";
import EmberObject from "@ember/object";
import { isArray } from "@ember/array";
import faker from "faker";

function monthDate(date) {
  let monthDate = new Date(date.getTime());
  monthDate.setHours(0, 0, 0, 0);
  monthDate.setDate(1);

  return monthDate;
}

function monthStub(type, data = {}) {
  let date = type === "currentMonth" ? new Date() : faker.date.past();
  const properties = Object.assign(
    {
      date: monthDate(date),
      save() {
        return this;
      }
    },
    data
  );
  return EmberObject.extend(properties).create();
}

const CurrentUserServiceStub = Service.extend({
  init() {
    this.set("user", EmberObject.create());
  }
});

const StoreStub = Service.extend({
  init() {
    this.set("returnValue", undefined);
  },
  setFindAllReturnValue(value) {
    this.set("returnValue", value);
  },
  findAll() {
    let retVal = this.get("returnValue");
    return Promise.resolve(isArray(retVal) ? retVal : emberArray([retVal]));
  },
  createRecord(modelName, data) {
    return monthStub("month", data);
  }
});

moduleFor("service:months-service", "Unit | Service | months service", {
  integration: true,
  beforeEach() {
    this.register("service:store", StoreStub);
    this.register("service:current-user", CurrentUserServiceStub);
    this.inject.service("store", { as: "storeStub" });
    this.inject.service("current-user", { as: "currentUserServiceStub" });
  }
});

test("it fetches the current month", async function(assert) {
  let expectedMonth = monthStub("currentMonth");
  this.storeStub.setFindAllReturnValue([expectedMonth, monthStub("month")]);
  let currentMonth = await this.subject().findCurrentMonth();

  assert.deepEqual(currentMonth, expectedMonth);
  assert.propEqual(currentMonth.get("date"), monthDate(new Date()));
});

test("it creates the current month if not present and returns it", async function(assert) {
  this.storeStub.setFindAllReturnValue(
    monthStub("month", {
      date: monthDate(new Date(2016, 2, 1))
    })
  );
  this.currentUserServiceStub.set(
    "user",
    EmberObject.create({
      currentBalance: 123.45
    })
  );
  let currentMonth = await this.subject().findCurrentMonth();

  assert.propEqual(currentMonth.get("date"), monthDate(new Date()));
  assert.equal(currentMonth.get("openingBalance"), 123.45);
});

test("it fetches a month by date", async function(assert) {
  let date = new Date(2017, 3, 21);
  let expectedMonth = monthStub("month", { date: monthDate(date) });
  this.storeStub.setFindAllReturnValue([expectedMonth, monthStub("month", { date: monthDate(new Date(2016, 2, 1)) })]);

  assert.deepEqual(await this.subject().findMonthByDate(date), expectedMonth);
});

test("if the month by date is not found, the service creates it", async function(assert) {
  this.storeStub.setFindAllReturnValue(
    monthStub("month", {
      date: monthDate(new Date(2016, 2, 1))
    })
  );
  this.currentUserServiceStub.set(
    "user",
    EmberObject.create({
      currentBalance: 123.45
    })
  );
  let date = new Date(2017, 3, 21);
  let month = await this.subject().findMonthByDate(date);

  assert.propEqual(month.get("date"), monthDate(date));
  assert.equal(month.get("openingBalance"), 123.45);
});
