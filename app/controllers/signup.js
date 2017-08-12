import Ember from "ember";
import { and, not } from "ember-awesome-macros";
import UserValidation from "pie/validations/user";
import lookupValidator from "ember-changeset-validations";
import Changeset from "ember-changeset";

const { run } = Ember;

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);
    this.changeset = new Changeset(this, lookupValidator(UserValidation), UserValidation);
  },
  formHasErrors: not(and("changeset.name", "changeset.initialBalance")),
  displayBalance: Ember.computed("changeset.initialBalance", {
    get() {
      let balance = Number(this.get("changeset.initialBalance"));
      return balance.toLocaleString("en-US");
    }
  }),
  actions: {
    async createUser() {
      if (this.changeset.isValid) {
        await this.changeset.save();

        const { name, initialBalance } = this.getProperties("name", "initialBalance");
        await run(() => {
          this.store
            .createRecord("user", {
              name,
              initialBalance,
              currentBalance: initialBalance
            })
            .save();
        });

        this.transitionToRoute("/");
      }
    }
  }
});
