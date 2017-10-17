import Service, { inject } from "@ember/service";
import { reject, resolve } from "rsvp";

export default Service.extend({
  session: inject(),
  load() {
    if (!this.get("session.isAuthenticated")) {
      return reject();
    }

    return resolve();
  }
});
