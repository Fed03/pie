import Ember from 'ember';
import { makeList } from 'ember-data-factory-guy';

export default Ember.Test.registerAsyncHelper('createList', function(app, modelName, num, options) {
  return Ember.run(() => {
    return Ember.Promise.all(makeList(modelName, num, options).map(model => model.save()));
  });
});
