import { run } from '@ember/runloop';
import { registerAsyncHelper } from '@ember/test';
import { make } from 'ember-data-factory-guy';

export default registerAsyncHelper('create', function(app, ...modelArgs) {
  return run(() => make(...modelArgs).save());
});
