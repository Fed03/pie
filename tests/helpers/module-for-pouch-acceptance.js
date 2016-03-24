// import PouchDB from 'pouchdb';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
// import config from '../../config/environment';
import destroyApp from '../helpers/destroy-app';

// let db = new PouchDB(config.emberPouch.localDb);

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
      // return db.destroy();
    },

    afterEach() {
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }

      destroyApp(this.application);
    }
  });
}
