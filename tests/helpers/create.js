import Ember from 'ember';
import { make } from 'ember-data-factory-guy';

export default Ember.Test.registerAsyncHelper('create', function(app, ...modelArgs) {
  return Ember.run(() => make(...modelArgs).save());
});
