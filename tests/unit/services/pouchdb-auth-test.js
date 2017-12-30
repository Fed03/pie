import { moduleFor } from "ember-qunit";
import test from "ember-sinon-qunit/test-support/test";
import sinon from "sinon";
import PouchDB from "pouchdb";

moduleFor("service:pouchdb-auth", "Unit | Service | pouchdb auth", {
  beforeEach() {
    this.authSetup = (options = {}) => {
      let defaultOptions = {
        localDb: "localDb",
        remoteHost: "host"
      };
      options = Object.assign(defaultOptions, options);

      let remoteDb = sinon.createStubInstance(PouchDB);
      remoteDb.login.returns(Promise.resolve());
      remoteDb.signup.returns(Promise.resolve());
      remoteDb.logout.returns(Promise.resolve());
      remoteDb.getSession.returns(Promise.resolve());
      remoteDb.getUser.returns(Promise.resolve());

      let localDb = sinon.createStubInstance(PouchDB);
      Object.defineProperty(localDb, "replicate", {
        value: {
          from: sinon.stub().returns(Promise.resolve())
        }
      });

      let PouchDBObj = this.stub();
      PouchDBObj.withArgs(options.localDb).returns(localDb);
      PouchDBObj.returns(remoteDb);

      return {
        service: this.subject({
          options,
          PouchDB: PouchDBObj
        }),
        PouchDBObj,
        localDb,
        remoteDb
      };
    };
  }
});

test("it inits the db", function(assert) {
  let options = { localDb: "foo" };
  let env = this.authSetup(options);

  assert.ok(env.PouchDBObj.calledWithNew());
  assert.ok(env.PouchDBObj.calledWithExactly("foo"));
  assert.equal(env.service.get("db"), env.localDb);
});

test("it registers a user", function(assert) {
  let env = this.authSetup();

  let promise = env.service.registerUser("foo", "password");
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(env.PouchDBObj.secondCall.calledWithNew());
  assert.ok(
    env.PouchDBObj.secondCall.calledWithExactly("host/userdb-666f6f", { skip_setup: true }),
    "Append the hex version of username foo"
  );

  assert.ok(env.remoteDb.signup.calledWithExactly("foo", "password"));
});

test("it builds metadata when registering user", function(assert) {
  let env = this.authSetup();

  env.service.registerUser("foo", "bar", {
    name: "john",
    age: 20
  });

  assert.ok(
    env.remoteDb.signup.calledWithExactly("foo", "bar", {
      metadata: {
        name: "john",
        age: 20
      }
    })
  );
});

test("it logs in a user", async function(assert) {
  let env = this.authSetup();

  let promise = env.service.login("foo", "password");
  assert.ok(promise instanceof Promise, "Returns a Promise");

  await promise;
  assert.ok(env.PouchDBObj.calledWithExactly("host/userdb-666f6f", { skip_setup: true }));
  assert.ok(env.remoteDb.login.calledWith("foo", "password"));
});

test("logging in sets a flag", async function(assert) {
  let env = this.authSetup();

  assert.equal(env.service.get("loggedIn"), false);

  await env.service.login("foo", "bar");
  assert.equal(env.service.get("loggedIn"), true);
});

test("it starts syncing when logged in", async function(assert) {
  assert.expect(2);
  let env = this.authSetup();

  await env.service.login("foo", "bar");

  assert.ok(env.localDb.replicate.from.calledWithExactly(env.remoteDb));
  assert.ok(
    env.localDb.sync.calledWithExactly(env.remoteDb, {
      live: true,
      retry: true
    })
  );
});

test("it logs out the user", async function(assert) {
  let env = this.authSetup();

  env.service.set("username", "foo");
  env.service.set("loggedIn", true);

  let promise = env.service.logout();
  assert.ok(promise instanceof Promise, "Returns a Promise");
  await promise;
  assert.equal(env.service.get("loggedIn"), false);
  assert.ok(env.remoteDb.logout.calledOnce);
});

test("logging out throws if not already logged in", function(assert) {
  let env = this.authSetup();

  assert.throws(() => {
    env.service.logout();
  }, /you must be logged in to call `logout\(\)`/i);
});

test("it gets the auth session from remote", function(assert) {
  let env = this.authSetup();

  env.service.set("username", "foo");

  let promise = env.service.getSession();
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(env.remoteDb.getSession.calledOnce);
});

test("it get the user info from remote", function(assert) {
  let env = this.authSetup();

  env.service.set("username", "foo");

  let promise = env.service.getUser();
  assert.ok(promise instanceof Promise, "Returns a Promise");

  assert.ok(env.remoteDb.getUser.calledWith("foo"));
});

test("it throws an error if remote methods are called without username being set", function(assert) {
  let env = this.authSetup();

  env.service.set("loggedIn", true);

  assert.throws(() => {
    env.service.logout();
  }, /username has not been set yet/i);

  assert.throws(() => {
    env.service.getSession();
  }, /username has not been set yet/i);

  assert.throws(() => {
    env.service.getUser();
  }, /username has not been set yet/i);
});

test("it throws an error if remote methods are called without a remoteHost option", function(assert) {
  let env = this.authSetup({ remoteHost: undefined });

  assert.throws(() => {
    env.service.login("foo", "bar");
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    env.service.registerUser("foo", "bar");
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    env.service.set("username", "foo");
    env.service.getUser();
  }, /'options.remoteHost' is empty/);

  assert.throws(() => {
    env.service.set("loggedIn", true);
    env.service.logout();
  }, /'options.remoteHost' is empty/);
});

test("it inits the remotedb just once", async function(assert) {
  let env = this.authSetup();
  let remoteStub = env.PouchDBObj.withArgs(sinon.match.string, sinon.match.object);

  await env.service.login("foo", "bar");
  await env.service.registerUser("foo", "bar");

  assert.equal(remoteStub.callCount, 1);
});
