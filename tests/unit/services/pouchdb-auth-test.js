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

  assert.ok(dbInstance.signup.calledWithExactly("foo", "password"));
});

test("it build metadata when registering user", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(dbInstance)
  });

  service.registerUser("foo", "bar", {
    name: "john",
    age: 20
  });

  assert.ok(
    dbInstance.signup.calledWithExactly("foo", "bar", {
      metadata: {
        name: "john",
        age: 20
      }
    })
  );
});

test("it logins a user", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.login.returns(Promise.resolve());

  let spy = this.stub().returns(sinon.createStubInstance(PouchDB));
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

test("login sets a flag", async function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.login.returns(Promise.resolve());

  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(dbInstance)
  });

  assert.equal(service.get("loggedIn"), false);

  await service.login("foo", "bar");
  assert.equal(service.get("loggedIn"), true);
});

test("it starts syncing when loggedIn", async function(assert) {
  let localDb = sinon.createStubInstance(PouchDB);
  let remoteDb = sinon.createStubInstance(PouchDB);
  remoteDb.login.returns(Promise.resolve());

  let PouchDBObj = this.stub();
  PouchDBObj.withArgs("localDb").returns(localDb);
  PouchDBObj.returns(remoteDb);

  let service = this.subject({
    options: {
      localDb: "localDb",
      remoteHost: "host"
    },
    PouchDB: PouchDBObj
  });

  await service.login("foo", "bar");

  assert.ok(
    localDb.sync.calledWithExactly(remoteDb, {
      live: true,
      retry: true
    })
  );
});

test("logout the user", async function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.logout.returns(Promise.resolve());

  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(dbInstance)
  });

  service.set("username", "foo");
  service.set("loggedIn", true);

  let promise = service.logout();
  assert.ok(promise instanceof Promise, "Returns a Promise");
  await promise;
  assert.equal(service.get("loggedIn"), false);
  assert.ok(dbInstance.logout.calledOnce);
});

test("logout throws if not already logged in", function(assert) {
  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub()
  });

  assert.throws(() => {
    service.logout();
  }, /you must be logged in to call `logout\(\)`/i);
});

test("it gets the auth session from remote", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.getSession.returns(Promise.resolve());

  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(dbInstance)
  });

  service.set("username", "foo");

  let promise = service.getSession();
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(dbInstance.getSession.calledOnce);
});

test("it get the user info from remote", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.getUser.returns(Promise.resolve());

  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(dbInstance)
  });

  service.set("username", "foo");

  let promise = service.getUser();
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(dbInstance.getUser.calledWith("foo"));
});

test("it throws an error if remote methods are called without username being set", function(assert) {
  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: this.stub().returns(sinon.createStubInstance(PouchDB))
  });

  service.set("loggedIn", true);

  assert.throws(() => {
    service.logout();
  }, /username has not been set yet/i);

  assert.throws(() => {
    service.getSession();
  }, /username has not been set yet/i);

  assert.throws(() => {
    service.getUser();
  }, /username has not been set yet/i);
});

test("it throws an error if remote methods are called without a remoteHost option", function(assert) {
  let service = this.subject({ PouchDB: this.stub().returns(sinon.createStubInstance(PouchDB)) });

  assert.throws(() => {
    service.login("foo", "bar");
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    service.registerUser("foo", "bar");
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    service.set("username", "foo");
    service.getUser();
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    service.set("loggedIn", true);
    service.logout();
  }, /'options.remoteHost' is empty/);
});

test("it inits the remotedb just once", function(assert) {
  let dbInstance = sinon.createStubInstance(PouchDB);
  dbInstance.login.returns(Promise.resolve());
  let stub = this.stub().returns(dbInstance);
  let remoteStub = stub.withArgs("host/userdb-666f6f", { skip_setup: true });
  let service = this.subject({
    options: {
      remoteHost: "host"
    },
    PouchDB: stub
  });
  service.login("foo", "bar");
  service.registerUser("foo", "bar");

  assert.equal(remoteStub.callCount, 1);
});
