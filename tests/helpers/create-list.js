import Ember from 'ember';
import { makeList } from 'ember-data-factory-guy';

export default Ember.Test.registerAsyncHelper('createList', function(app, ...modelArgs) {
  return Ember.run(() => {
    return Ember.RSVP.Promise.all(makeList(...modelArgs).map(model => model.save()));
  });
});
