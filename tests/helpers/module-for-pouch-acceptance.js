import { Promise } from 'rsvp';
import { module } from "qunit";
import startApp from "../helpers/start-app";
import destroyPouchDb from "../helpers/destroy-db";
import destroyApp from "../helpers/destroy-app";

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      let initPromise = Promise.resolve()
        .then(() => {
          return destroyPouchDb();
        })
        .then(() => {
          this.application = startApp();
        });

      if (options.beforeEach) {
        initPromise.then(() => options.beforeEach.apply(this, arguments));
      }

      return initPromise;
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    }
  });
}
