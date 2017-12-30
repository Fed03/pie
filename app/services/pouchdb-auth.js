/*eslint no-console: off*/
import { registerWaiter } from "@ember/test";
import Service from "@ember/service";
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

export default Service.extend({
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
      registerWaiter(() => this.waiters === 0);
    }
  },

  registerUser(username, password, metadata) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();

    return this._dbOperation(() => {
      if (metadata) {
        return remoteDb.signup(username, password, { metadata });
      } else {
        return remoteDb.signup(username, password);
      }
    });
  },

  login(username, password) {
    if (!this.get("username")) {
      this.set("username", username);
    }
    const remoteDb = this._initRemoteDb();

    return this._dbOperation(() => {
      return remoteDb.login(username, password).then(data => {
        this.set("loggedIn", true);
        let localDb = this.get("db");
        return new Promise((resolve, reject) => {
          localDb.replicate
            .from(remoteDb)
            .once("complete", () => {
              localDb.sync(remoteDb, {
                live: true,
                retry: true
              });

              resolve(data);
            })
            .once("error", () => {
              console.warn(arguments);
              reject(arguments);
            });
        });
      });
    });
  },

  logout() {
    assert("You must be logged in to call `logout()`", this.get("loggedIn"));
    const remoteDb = this._initRemoteDb();
    return this._dbOperation(() => {
      return remoteDb.logout().then(response => {
        this.set("loggedIn", false);

        return response;
      });
    });
  },

  getSession() {
    const remoteDb = this._initRemoteDb();
    return this._dbOperation(() => remoteDb.getSession());
  },

  getUser() {
    const remoteDb = this._initRemoteDb();
    return this._dbOperation(() => remoteDb.getUser(this.get("username")));
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
  },

  _dbOperation(promise) {
    this.waiters++;
    return promise()
      .then(result => {
        this.waiters--;
        return result;
      })
      .catch(e => {
        this.waiters--;
        throw e;
      });
  }
});
