import Ember from "ember";
import { or, not } from "ember-awesome-macros";
import UserValidation from "pie/validations/user";
import lookupValidator from "ember-changeset-validations";
import Changeset from "ember-changeset";
import { inject } from "@ember/service";

const { run } = Ember;

export default Ember.Controller.extend({
  pouchDbService: inject("pouchdb-auth"),
  session: inject(),
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
    // updateBalance(inputBalance) {
    //   let number = Number(inputBalance);
    //   if (number === 0) {
    //     this.set("displayBalance", "");
    //   } else {
    //     let display = number.toLocaleString("en-US");
    //     if (inputBalance.slice(-1) === ".") {
    //       display += ".";
    //     }
    //     this.set("displayBalance", display);
    //   }
    //
    //   this.changeset.set("initialBalance", number);
    // },
    async createUser() {
      if (this.changeset.isValid) {
        await this.changeset.save();

        const { name, password, initialBalance } = this.getProperties("name", "password", "initialBalance");
        await this.get("pouchDbService").registerUser(name, password, { dbId: 1 });
        await this.get("session").authenticate("authenticator:couchdb", name, password);
        await run(() => {
          return this.store
            .createRecord("user", {
              id: 1,
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
