import {
  Adapter
} from 'ember-pouch';
import PouchDB from 'pouchdb';
import config from 'offline-app/config/environment';
import Ember from 'ember';

const {
  assert,
  isEmpty,
  RSVP: {
    Promise
  }
} = Ember;

function createDb(adapter) {
  let localDb = config.emberPouch.localDb;
  assert('emberPouch.localDb must be set', !isEmpty(localDb));

  let db = new PouchDB(localDb);
  adapter.set('db', db);

  if (config.emberPouch.remoteDb) {
    let remoteDb = new PouchDB(config.emberPouch.remoteDb);
    return db.allDocs().then(result => {
      if (result.total_rows !== 0) {
        db.sync(remoteDb, {
          live: true,
          retry: true
        });

        return Promise.resolve();
      }

      let counter = 0;
      return new Promise(function(resolve) {
        db.sync(remoteDb, {
          live: true,
          retry: true
        }).on('paused', function() {
          if (counter === 1) {
            resolve();
          } else {
            counter++;
          }
        });
      });
    });
  }

  return Promise.resolve();
}

export default Adapter.extend({
  init() {
    this._super(...arguments);
    this.set('promise', createDb(this));
  }
});
