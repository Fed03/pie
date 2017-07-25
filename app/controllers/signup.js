import Ember from "ember";

export default Ember.Controller.extend({
  displayBalance: Ember.computed("balance", {
    get() {
      let balance = Number(this.get("balance"));
      return balance.toLocaleString("en-US");
    }
  }),
  actions: {
    async createUser() {
      const { username, balance } = this.getProperties("username", "balance");
      await this.store
        .createRecord("user", {
          name: username,
          initialBalance: balance,
          currentBalance: balance
        })
        .save();

      this.transitionToRoute("/");
    }
  }
});
