import { Adapter } from "ember-pouch";
// import PouchDB from "pouchdb";
// import config from "pie/config/environment";
import { inject } from "@ember/service";

// const { assert, isEmpty } = Ember;
//
// function createDb() {
//   let localDb = config.emberPouch.localDb;
//
//   assert("emberPouch.localDb must be set", !isEmpty(localDb));
//
//   let db = new PouchDB(localDb);
//
//   if (config.environment == "test") {
//     db.setMaxListeners(100);
//   }
//
//   if (config.emberPouch.remoteDb) {
//     let remoteDb = new PouchDB(config.emberPouch.remoteDb);
//
//     db.sync(remoteDb, {
//       live: true,
//       retry: true
//     });
//   }
//
//   return db;
// }

export default Adapter.extend({
  pouchDbService: inject("pouchdb-auth"),
  init() {
    this._super(...arguments);
    this.set("db", this.get("pouchDbService.db"));
  }
});
