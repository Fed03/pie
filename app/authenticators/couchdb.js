import Base from "ember-simple-auth/authenticators/base";
import { inject } from "@ember/service";

export default Base.extend({
  pouchDbService: inject("pouchdb-auth"),
  restore(data) {
    console.log("restore", data);
  },

  authenticate(username, password) {
    const service = this.get("pouchDbService");
    return service.login(username, password).then(() => {
      return service.getUser();
    });
  },

  invalidate(data) {}
});
