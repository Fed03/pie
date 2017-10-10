import Ember from "ember";
import PouchDB from "pouchdb";
import { assert } from "@ember/debug";
import { isPresent } from "@ember/utils";
import { computed } from "@ember/object";
import { getOwner } from "@ember/application";

function stringToHex(string) {
  let hex = "";
  for (let i = 0; i < string.length; i++) {
    hex += string.charCodeAt(i).toString(16);
  }

  return hex;
}

export default Ember.Service.extend({
  waiters: 0,
  PouchDB,

  hexUserName: computed("username", {
    get() {
      return stringToHex(this.get("username"));
    }
  }),

  loggedIn: false,

  init() {
    this.options = this._buildOptions();
    this.set("db", new this.PouchDB(this.options.localDb));
    if (Ember.testing) {
      Ember.Test.registerWaiter(() => this.waiters === 0);
    }
  },

  registerUser(username, password, metadata) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();
    this.waiters++;
    if (metadata) {
      return remoteDb.signup(username, password, { metadata }).then(response => {
        this.waiters--;
        return response;
      });
    } else {
      return remoteDb.signup(username, password);
    }
  },

  login(username, password) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();
    this.waiters++;
    return remoteDb.login(username, password).then(data => {
      this.waiters--;
      this.set("loggedIn", true);
      this.get("db").sync(remoteDb, {
        live: true,
        retry: true
      });

      return data;
    });
  },

  logout() {
    assert("You must be logged in to call `logout()`", this.get("loggedIn"));
    const remoteDb = this._initRemoteDb();
    return remoteDb.logout().then(response => {
      this.set("loggedIn", false);

      return response;
    });
  },

  getSession() {
    const remoteDb = this._initRemoteDb();
    return remoteDb.getSession();
  },

  getUser() {
    const remoteDb = this._initRemoteDb();
    this.waiters++;
    return remoteDb.getUser(this.get("username")).then(response => {
      this.waiters--;
      return response;
    });
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
  },

  _buildOptions() {
    let defaultOptions = {};
    let config = getOwner(this).resolveRegistration("config:environment");
    if (config && config.emberPouch) {
      defaultOptions = config.emberPouch;
    }

    return Object.assign(defaultOptions, this.options || {});
  }
});
