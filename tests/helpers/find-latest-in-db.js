import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('findLatestInDb', function(app, modelName) {
  const store = app.__container__.lookup('service:store');
  return store.findAll(modelName).then(collection => {
    if(collection.get('length') === 0) {
      throw new Ember.Error(`No records found for '${modelName}'`);
    }
    return collection.get('lastObject');
  });
});
