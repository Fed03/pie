import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return this.store.findAll("category");
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.resetToDefaultProperties();
    }
  }
});
