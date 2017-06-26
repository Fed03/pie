import Ember from "ember";
import faker from "faker";

export default Ember.Route.extend({
  beforeModel() {
    //TODO adjust this
    return this.store.findAll("category").then(categories => {
      if (categories.get("length") == 0) {
        let promises = [];
        for (var i = 0; i < 4; i++) {
          let cat = this.store.createRecord("category", {
            name: faker.commerce.department(),
            type: faker.random.arrayElement(["income", "outcome"])
          });

          promises.push(cat.save());
        }
        return Ember.RSVP.all(promises);
      }
    });
  }
});
