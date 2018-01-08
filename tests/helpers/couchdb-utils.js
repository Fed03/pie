import PouchDB from "pouchdb";

function stringToHex(string) {
  let hex = "";
  for (let i = 0; i < string.length; i++) {
    hex += string.charCodeAt(i).toString(16);
  }

  return hex;
}

function delayPromise(time) {
  return function(previouslyResolvedData) {
    return new Promise(resolve => {
      let id = setTimeout(() => {
        clearTimeout(id);
        resolve(previouslyResolvedData);
      }, time);
    });
  };
}

const couchDB = {
  init(application) {
    this.config = application.resolveRegistration("config:environment");
    this.remoteHost = this.config.emberPouch.remoteHost;
    this.headers = this._createHeaders();
  },
  _createHeaders() {
    const { username, password } = this.config.couchDbCredentials;
    return new Headers({
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      "Content-Type": "application/json"
    });
  },

  _deleteUsers() {
    return fetch(`${this.remoteHost}/_users/_all_docs`, { headers: this.headers })
      .then(response => response.json())
      .then(data => {
        let body = [];
        data.rows.forEach(doc => {
          if (!doc.key.startsWith("_")) {
            body.push({
              _id: doc.id,
              _rev: doc.value.rev,
              _deleted: true
            });
          }
        });
        return fetch(`${this.remoteHost}/_users/_bulk_docs`, {
          method: "POST",
          body: JSON.stringify({ docs: body }),
          headers: this.headers
        });
      });
  },

  async _deleteUsersDb() {
    const allDbs = await fetch(`${this.remoteHost}/_all_dbs`).then(response => response.json());
    const filteredDbs = allDbs.filter(db => db.startsWith("userdb"));

    let promises = [];
    for (let db of filteredDbs) {
      promises.push(fetch(`${this.remoteHost}/${db}`, { method: "DELETE", headers: this.headers }));
    }

    return Promise.all(promises);
  },

  resetCouchDb() {
    return Promise.all([this._deleteUsers(), this._deleteUsersDb()]);
  },

  findCouchUserByName(name) {
    return fetch(`${this.remoteHost}/_users/org.couchdb.user:${name}`, { headers: this.headers }).then(response => response.json());
  },

  async registerUser(username, password) {
    const db = new PouchDB(`${this.remoteHost}/dummy`, { skip_setup: true });
    await db
      .signup(username, password, {
        metadata: {
          baseUserId: this.config.baseUserId
        }
      })
      .then(delayPromise(500));

    const userDb = `${this.remoteHost}/userdb-${stringToHex(username)}`;
    await fetch(userDb, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        _id: `user_2_${this.config.baseUserId}`,
        data: {
          name: username
        }
      })
    });
  }
};

const resetCouchDb = couchDB.resetCouchDb.bind(couchDB);
const findCouchUserByName = couchDB.findCouchUserByName.bind(couchDB);
const initCouchDB = couchDB.init.bind(couchDB);
const registerUser = couchDB.registerUser.bind(couchDB);

export { resetCouchDb, findCouchUserByName, initCouchDB, registerUser };
