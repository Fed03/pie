import { all } from "rsvp";
import Route from "@ember/routing/route";
import { inject } from "@ember/service";
import faker from "faker";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";

export default Route.extend(ApplicationRouteMixin, {
  currentUser: inject(),
  routeAfterAuthentication: "months.index",
  beforeModel() {
    return all([this._createDefaultCategories(), this.get("currentUser").load()]);
  },
  sessionAuthenticated() {
    let superMethod = this._super.bind(this, ...arguments);
    this.get("currentUser")
      .load()
      .then(() => {
        superMethod();
      });
  },
  _createDefaultCategories() {
    //TODO adjust this
    return this.store.findAll("category").then(categories => {
      if (categories.get("length") === 0) {
        let promises = [];
        let type = ["income", "outcome"];
        for (var i = 0; i < 10; i++) {
          let cat = this.store.createRecord("category", {
            name: faker.commerce.department(),
            type: type[i % 2]
          });

          promises.push(cat.save());
        }
        return all(promises);
      }
      return Promise.resolve();
    });
  }
});
