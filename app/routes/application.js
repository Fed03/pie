import Ember from "ember";
import faker from "faker";

export default Ember.Route.extend({
  beforeModel() {
    //TODO adjust this
    return this.store.findAll("category").then(categories => {
      if (categories.get("length") == 0) {
        let promises = [];
        let type = ["income", "outcome"];
        for (var i = 0; i < 10; i++) {
          let cat = this.store.createRecord("category", {
            name: faker.commerce.department(),
            type: type[i % 2]
          });

          promises.push(cat.save());
        }
        return Ember.RSVP.all(promises);
      }
    });
  },
  model() {
    return this.store.findAll("user");
  },
  setupController(controller, model) {
    if (model.get("length") !== 0) {
      controller.set("authUser", model.get("firstObject"));
    }
  }
});
