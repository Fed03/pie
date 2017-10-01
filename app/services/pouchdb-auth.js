import Ember from "ember";
import PouchDB from "pouchdb";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { computed } from "@ember/object";

function stringToHex(string) {
  let hex = "";
  for (let i = 0; i < string.length; i++) {
    hex += string.charCodeAt(i).toString(16);
  }

  return hex;
}

export default Ember.Service.extend({
  PouchDB,

  hexUserName: computed("username", {
    get() {
      return stringToHex(this.get("username"));
    }
  }),

  loggedIn: false,

  init() {
    this.options = this.options || {};
    this.set("db", new this.PouchDB(this.options.localDb));
  },

  registerUser(username, password) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();
    return remoteDb.signup(username, password);
  },

  login(username, password) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();
    const promise = remoteDb.login(username, password);
    promise.then(() => {
      this.set("loggedIn", true);
    });

    return promise;
  },

  logout() {
    assert("You must be logged in to call `logout()`", this.get("loggedIn"));
    const remoteDb = this._initRemoteDb();
    const promise = remoteDb.logout();
    promise.then(() => {
      this.set("loggedIn", false);
    });

    return promise;
  },

  getSession() {
    const remoteDb = this._initRemoteDb();
    return remoteDb.getSession();
  },

  _initRemoteDb() {
    assert("username has not been set yet", isPresent(this.get("username")));
    let remoteDb = this.get("remoteDb");
    if (!remoteDb) {
      assert("'options.remoteHost' is empty!", isPresent(this.options.remoteHost));

      const url = `${this.options.remoteHost}/userdb-${this.get("hexUserName")}`;
      remoteDb = new this.PouchDB(url, { skip_setup: true });
      this.set("remoteDb", remoteDb);
    }
    return remoteDb;
  }
});
