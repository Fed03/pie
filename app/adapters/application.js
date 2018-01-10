import { Adapter } from "ember-pouch";
import { inject } from "@ember/service";

export default Adapter.extend({
  pouchDbService: inject("pouchdb-auth"),
  init() {
    this._super(...arguments);
    this.set("db", this.get("pouchDbService.db"));
  }
});
