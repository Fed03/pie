import Base from "ember-simple-auth/authenticators/base";
import { inject } from "@ember/service";
import Promise from "rsvp";

export default Base.extend({
  pouchDbService: inject("pouchdb-auth"),
  restore(data = {}) {
    if (!(data.name && data.password)) {
      return Promise.reject();
    }

    return this.authenticate(data.name, data.password);
  },

  authenticate(username, password) {
    const service = this.get("pouchDbService");
    return service
      .login(username, password)
      .then(() => service.getUser())
      .then(userData => Object.assign(userData, { password }));
  },

  invalidate() {
    return this.get("pouchDbService").logout();
  }
});
