import { Promise } from "rsvp";
import { module } from "qunit";
import startApp from "../helpers/start-app";
import destroyPouchDb from "../helpers/destroy-db";
import destroyApp from "../helpers/destroy-app";

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      let promises = [];
      let initPromise = Promise.resolve()
        .then(() => {
          return destroyPouchDb();
        })
        .then(() => {
          this.application = startApp();
        });

      promises.push(initPromise);
      if (options.beforeEach) {
        let promise = initPromise.then(() => options.beforeEach.apply(this, arguments));
        promises.push(promise);
      }

      return Promise.all(promises);
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    }
  });
}
