export function destroyPouchDB(application) {
  let db = application.__container__.lookup('adapter:application').get('db');
  return db.destroy();
}

export default {
  destroyPouchDB
};
