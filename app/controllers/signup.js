import Ember from "ember";
import { or, not } from "ember-awesome-macros";
import UserValidation from "pie/validations/user";
import lookupValidator from "ember-changeset-validations";
import Changeset from "ember-changeset";

const { run } = Ember;

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);
    this.changeset = new Changeset(this, lookupValidator(UserValidation), UserValidation);
  },
  formHasErrors: or(not("changeset.initialBalance"), not("changeset.name"), "changeset.isInvalid"),
  // displayBalance: Ember.computed("changeset.initialBalance", {
  //   get() {
  //     let balance = Number(this.get("changeset.initialBalance"));
  //     return Number.isNaN(balance) ? "" : balance.toLocaleString("en-US");
  //   }
  // }),
  displayBalance: "",
  actions: {
    updateBalance(inputBalance) {
      // const lastChar = inputBalance.slice(-1);
      // if (lastChar === '.') {
      //
      // }

      let number = Number(inputBalance);
      if (number === 0) {
        this.set("displayBalance", "");
      } else {
        this.set("displayBalance", number);
      }

      this.changeset.set("initialBalance", number);
    },
    async createUser() {
      if (this.changeset.isValid) {
        await this.changeset.save();

        const { name, initialBalance } = this.getProperties("name", "initialBalance");
        await run(() => {
          return this.store
            .createRecord("user", {
              name,
              initialBalance,
              currentBalance: initialBalance
            })
            .save();
        });

        this.transitionToRoute("/");
      }
    },
    validateProperty(key) {
      this.changeset.validate(key);
    }
  }
});
