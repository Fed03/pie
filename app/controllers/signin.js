import Controller from "@ember/controller";
import { or, not } from "ember-awesome-macros";
import Changeset from "ember-changeset";
import UserValidation from "pie/validations/user";
import lookupValidator from "ember-changeset-validations";

export default Controller.extend({
  formHasErrors: or(not("changeset.name"), not("changeset.password"), "changeset.isInvalid"),

  init() {
    this._super(...arguments);
    this.changeset = new Changeset(this, lookupValidator(UserValidation), UserValidation);
  },

  actions: {
    validateProperty(key) {
      this.changeset.validate(key);
    }
  }
});
