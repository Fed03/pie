import PouchDB from "pouchdb";
import config from "../../config/environment";

export default function destroyPouchDb() {
  return new PouchDB(config.emberPouch.localDb).destroy();
}
