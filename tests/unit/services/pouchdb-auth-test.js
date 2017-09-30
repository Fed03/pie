import { moduleFor } from "ember-qunit";
import test from "ember-sinon-qunit/test-support/test";

moduleFor("service:pouchdb-auth", "Unit | Service | pouchdb auth");

test("it inits the db", function(assert) {
  let dbInstance = {};
  let spy = this.stub().returns(dbInstance);
  let options = { localDb: "foo" };
  let service = this.subject({ options, PouchDB: spy });

  assert.ok(spy.calledWithNew());
  assert.ok(spy.calledWithExactly("foo"));
  assert.equal(service.get("db"), dbInstance);
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
