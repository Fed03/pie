import { moduleFor } from "ember-qunit";
import test from "ember-sinon-qunit/test-support/test";
import sinon from "sinon";
import PouchDB from "pouchdb";

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

test("it registers a user", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.signup.returns(Promise.resolve());
  let spy = this.stub().returns(dbInstance);
  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: spy
  });

  let promise = service.registerUser("foo", "password");
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(spy.secondCall.calledWithNew());
  assert.ok(spy.secondCall.calledWithExactly("host/userdb-666f6f", { skip_setup: true }), "Append the hex version of username foo");

  assert.ok(dbInstance.signup.calledWith("foo", "password"));
});

test("it logins a user", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.login.returns(Promise.resolve());

  let spy = this.stub();
  spy.withArgs("host/userdb-666f6f", { skip_setup: true }).returns(dbInstance);

  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: spy
  });

  let promise = service.login("foo", "password");
  assert.ok(promise instanceof Promise, "Returns a Promise");
  assert.ok(spy.calledWithExactly("host/userdb-666f6f", { skip_setup: true }));

  assert.ok(dbInstance.login.calledWith("foo", "password"));
});

test("it throws an error if remote methods are called without a remoteHost option", function(assert) {
  let service = this.subject({ PouchDB: this.stub().returns(sinon.createStubInstance(PouchDB)) });

  assert.throws(() => {
    service.login("foo", "bar");
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    service.registerUser("foo", "bar");
  }, /'options.remoteHost' is empty/);
});
