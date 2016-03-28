import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('makeModel', function(app, modelName, options) {
  const store = app.__container__.lookup('service:store');
  return Ember.run(() => {
    return store.createRecord(modelName, options).save();
  });
});
