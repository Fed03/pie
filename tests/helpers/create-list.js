import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { registerAsyncHelper } from '@ember/test';
import { makeList } from 'ember-data-factory-guy';

export default registerAsyncHelper('createList', function(app, ...modelArgs) {
  return run(() => {
    return EmberPromise.all(makeList(...modelArgs).map(model => model.save()));
  });
});
