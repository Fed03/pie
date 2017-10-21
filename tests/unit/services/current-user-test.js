import { moduleFor, skip } from "ember-qunit";
import Service from "@ember/service";
import test from "ember-sinon-qunit/test-support/test";

const SessionStub = Service.extend({
  init() {
    this.setProperties({
      isAuthenticated: true,
      data: {
        authenticated: {
          baseUserId: 1
        }
      }
    });
  },
  removeUserIdFromData() {
    this.set("data.authenticated.baseUserId", null);
  }
});

const StoreStub = Service.extend({
  findRecord() {
    return Promise.resolve("userData");
  }
});

moduleFor("service:current-user", "Unit | Service | current user", {
  beforeEach() {
    this.register("service:session", SessionStub);
    this.register("service:store", StoreStub);
    this.inject.service("session", { as: "sessionStub" });
    this.inject.service("store", { as: "storeStub" });
  }
});

skip("it returns a rejecting promise if session is not authenticated", function(assert) {
  assert.expect(1);
  let service = this.subject();
  this.sessionStub.set("isAuthenticated", false);

  return service.load().catch(() => {
    assert.ok(true, "Rejecting promise returned");
  });
});

test("it returns an empty resolving promise if session data does not contain the user id", function(assert) {
  let service = this.subject();
  this.sessionStub.removeUserIdFromData();

  return service.load().then(resolvedValue => {
    assert.equal(resolvedValue, undefined, "The promise value is empty");
    assert.ok(true, "Resolving promise returned");
  });
});

test("it returns a promise with resolving data and sets a property", async function(assert) {
  let spy = this.spy(this.storeStub, "findRecord");
  let service = this.subject();

  let userData = await service.load();
  assert.equal(userData, "userData", "Returned value is correct");
  assert.equal(service.get("user"), "userData", "Value is set on service");

  assert.ok(
    spy.calledWithExactly("user", this.sessionStub.get("data.authenticated.baseUserId")),
    "`findRecord` called with the right args"
  );
});
