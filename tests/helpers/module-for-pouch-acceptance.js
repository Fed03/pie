import {
  module
} from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }


      let db = this.application.__container__.lookup('adapter:application').get('db');
      return db.destroy();
    },

    afterEach() {
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }

      destroyApp(this.application);
    }
  });
}
