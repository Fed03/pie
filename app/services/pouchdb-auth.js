import Ember from "ember";
import PouchDB from "pouchdb";
function stringToHex(string) {
  let hex = "";
  for (let i = 0; i < string.length; i++) {
    hex += string.charCodeAt(i).toString(16);
  }

  return hex;
}

export default Ember.Service.extend({
  PouchDB,
  init() {
    this.options = this.options || {};
    this.set("db", new this.PouchDB(this.options.localDb));
  },

  registerUser(username, password) {
    const remoteDb = this._initRemoteDb(username);
    return remoteDb.signup(username, password);
  },

  login(username, password) {
    const remoteDb = this._initRemoteDb(username);
    return remoteDb.login(username, password);
  },

  _initRemoteDb(username) {
    const hexUserName = stringToHex(username);
    const url = `${this.options.remoteHost}/userdb-${hexUserName}`;
    const remoteDb = new this.PouchDB(url, { skip_setup: true });
    this.set("remoteDb", remoteDb);
    return remoteDb;
  }
});
