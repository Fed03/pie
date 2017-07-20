import Ember from "ember";

export default Ember.Mixin.create({
  async beforeModel() {
    let user = await this.store.findAll("user").then(users => users.get("firstObject"));
    if (!user) {
      this.transitionTo("signup");
    }
  }
});
