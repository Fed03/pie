import { moduleFor, test } from "ember-qunit";
import Service from "@ember/service";

const SessionStub = Service.extend({
  isAuthenticated: true,
  data: {
    authenticated: {
      baseUserId: 1
    }
  },
  removeUserIdFromData() {
    delete this.data.authenticated.baseUserId;
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
    this.inject.service("session");
  }
});

test("it returns a rejecting promise if session is not authenticated", function(assert) {
  assert.expect(1);
  let service = this.subject();
  this.session.set("isAuthenticated", false);

  return service.load().catch(() => {
    assert.ok(true);
  });
});

test("it returns an empty resolving promise if session data does not contain the user id", function(assert) {
  let service = this.subject();
  this.session.removeUserIdFromData();

  return service.load().then(() => {
    assert.ok(true);
  });
});
