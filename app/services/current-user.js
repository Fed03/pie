import Service, { inject } from "@ember/service";
import { reject, resolve } from "rsvp";
import { isBlank } from "@ember/utils";

export default Service.extend({
  session: inject(),
  store: inject(),
  load() {
    if (!this.get("session.isAuthenticated")) {
      return reject();
    }

    const userId = this.get("session.data.authenticated.baseUserId");
    if (isBlank(userId)) {
      return resolve();
    }

    return this.get("store")
      .findRecord("user", userId)
      .then(user => {
        this.set("user", user);
        return user;
      });
  }
});
