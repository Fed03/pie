import Controller from "@ember/controller";
import { or, not } from "ember-awesome-macros";
import Changeset from "ember-changeset";
import { inject } from "@ember/service";
import UserValidation from "pie/validations/user";
import lookupValidator from "ember-changeset-validations";

export default Controller.extend({
  session: inject(),
  formHasErrors: or(not("changeset.name"), not("changeset.password"), "changeset.isInvalid"),

  init() {
    this._super(...arguments);
    this.changeset = new Changeset({}, lookupValidator(UserValidation), UserValidation);
  },

  actions: {
    async signin() {
      if (this.changeset.get("isValid")) {
        const { name, password } = this.changeset.getProperties("name", "password");
        try {
          await this.get("session").authenticate("authenticator:couchdb", name, password);
        } catch ({ message }) {
          this.set("errorMsg", message);
        }
      }
    },
    validateProperty(key) {
      this.changeset.validate(key);
    }
  }
});
