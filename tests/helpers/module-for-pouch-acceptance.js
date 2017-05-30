import Ember from 'ember';
import PouchDB from 'pouchdb';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
import config from '../../config/environment';
import destroyApp from '../helpers/destroy-app';

const { RSVP: { Promise } } = Ember;

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      let initPromise = Promise.resolve().then(() => {
        return (new PouchDB(config.emberPouch.localDb)).destroy();
      }).then(() => {
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
