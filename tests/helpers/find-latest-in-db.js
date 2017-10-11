import EmberError from '@ember/error';
import { registerAsyncHelper } from '@ember/test';

export default registerAsyncHelper("findLatestInDb", function(app, modelName) {
  const store = app.__container__.lookup("service:store");
  return store.findAll(modelName, { reload: true }).then(collection => {
    if (collection.get("length") === 0) {
      throw new EmberError(`No records found for '${modelName}'`);
    }
    return collection.get("lastObject");
  });
});
