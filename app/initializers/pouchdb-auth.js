import PouchDB from "pouchdb";
import PouchAuth from "pouchdb-authentication";

export function initialize() {
  PouchDB.plugin(PouchAuth);
}

export default {
  initialize
};
