import Ember from 'ember';
import { make } from 'ember-data-factory-guy';

export default Ember.Test.registerAsyncHelper('create', function(app, modelName, options) {
  return Ember.run(() => make(modelName, options).save());
});
