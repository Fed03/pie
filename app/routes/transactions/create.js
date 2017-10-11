import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll("category");
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.resetToDefaultProperties();
    }
  }
});
