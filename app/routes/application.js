import { all } from "rsvp";
import Route from "@ember/routing/route";
import { inject } from "@ember/service";
import faker from "faker";
import { run } from "@ember/runloop";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";

export default Route.extend(ApplicationRouteMixin, {
  currentUser: inject(),
  session: inject(),
  routeAfterAuthentication: "months.index",
  beforeModel() {
    return all([this._createDefaultCategories(), this.get("currentUser").load()]);
  },
  sessionAuthenticated() {
    let superMethod = this._super.bind(this, ...arguments);
    this._createDefaultCategories();
    this.get("currentUser")
      .load()
      .then(() => {
        superMethod();
      });
  },
  async _createDefaultCategories() {
    //TODO adjust this
    let promise = Promise.resolve();
    if (this.get("session.isAuthenticated")) {
      let catNumber = (await this.store.findAll("category")).get("length");
      if (catNumber === 0) {
        let promises = [];
        let type = ["income", "outcome"];
        run(() => {
          for (var i = 0; i < 10; i++) {
            let cat = this.store.createRecord("category", {
              name: faker.commerce.department(),
              type: type[i % 2]
            });
            promises.push(cat.save());
          }
        });
        promise = all(promises);
      }
    }

    return promise;
  }
});
