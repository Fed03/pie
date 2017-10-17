import { moduleFor } from "ember-qunit";
import Service from "@ember/service";
import test from "ember-sinon-qunit/test-support/test";

const PouchDBAuthServiceStub = Service.extend({
  metadata: {},
  setMetadataUsedDuringRegistration(metadata) {
    this.set("metadata", metadata);
  },
  login(name) {
    this.setProperties({ name });
    return Promise.resolve();
  },
  logout() {},
  getUser() {
    let { name, metadata } = this.getProperties("name", "metadata");
    return Promise.resolve(
      Object.assign(
        {
          _id: "org.couchdb.user:aquaman",
          _rev: "1-60288b5b056a8af31e910bca2523ea6a",
          derived_key: "05c3314f180faed646af3b77e637ffecf2e3fb93",
          iterations: 10,
          name,
          password_scheme: "pbkdf2",
          roles: [],
          salt: "bce14111a559e00587f3e5f207e4a316",
          type: "user"
        },
        metadata
      )
    );
  }
});

moduleFor("authenticator:couchdb", "Unit | Authenticator | couchdb", {
  unit: true,
  beforeEach() {
    this.register("service:pouchdb-auth", PouchDBAuthServiceStub);
    this.inject.service("pouchdb-auth", { as: "pouchDbStub" });
  }
});

test("#authenticate successful returns data containing name and password", async function(assert) {
  let authenticator = this.subject();

  let data = await authenticator.authenticate("john", "foo");
  assert.equal(data.name, "john");
  assert.equal(data.password, "foo");
});

test("#authenticate successful returns data containing also optional metadata", async function(assert) {
  let authenticator = this.subject();
  this.pouchDbStub.setMetadataUsedDuringRegistration({
    likes: ["jane", "johnny"],
    age: 20
  });

  let data = await authenticator.authenticate("john", "foo");
  assert.propEqual(data.likes, ["jane", "johnny"]);
  assert.equal(data.age, 20);
});

test("#invalidate", function(assert) {
  let spy = this.stub(this.pouchDbStub, "logout").returns("foo");
  let response = this.subject().invalidate();

  assert.ok(spy.calledOnce, "It calls the 'logout' method on pouchDB service");
  assert.equal(response, "foo", "It returns the same data as the 'logout' method on pouchDB service");
});

test("#restore with data not containing name or password returns a rejecting promise", async function(assert) {
  assert.expect(1);
  let authenticator = this.subject();

  try {
    await authenticator.restore();
  } catch (e) {
    assert.ok(true, "It was rejected");
  }
});

test("#restore will recall #authenticate and returns its response", async function(assert) {
  let authenticator = this.subject();
  let spy = this.stub(authenticator, "authenticate").returns("data");

  let response = await authenticator.restore({ name: "john", password: "foo" });
  assert.ok(spy.calledWithExactly("john", "foo"));
  assert.equal(response, "data");
});
