import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    createUser() {
      return this.store.createRecord("user", {});
    }
  }
});
