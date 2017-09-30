import Ember from "ember";
import PouchDB from "pouchdb";

export default Ember.Service.extend({
  PouchDB,
  init() {
    this.options = this.options || {};
    this.set("db", new this.PouchDB(this.options.localDb));
  }
});
