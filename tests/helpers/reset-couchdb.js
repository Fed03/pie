function createHeaders(config) {
  return new Headers({
    Authorization: `Basic ${btoa(`${config.couchDbCredentials.username}:${config.couchDbCredentials.password}`)}`,
    "Content-Type": "application/json"
  });
}

function deleteUsers(remoteHost, headers) {
  return fetch(`${remoteHost}/_users/_all_docs`, { headers })
    .then(response => response.json())
    .then(data => {
      let body = [];
      data.rows.forEach(doc => {
        if (!doc.key.startsWith("_")) {
          body.push({
            _id: doc.id,
            _rev: doc.value.rev,
            _deleted: true
          });
        }
      });
      return fetch(`${remoteHost}/_users/_bulk_docs`, { method: "POST", body: JSON.stringify({ docs: body }), headers });
    });
}

async function deleteUsersDb(remoteHost, headers) {
  const allDbs = await fetch(`${remoteHost}/_all_dbs`).then(response => response.json());
  const filteredDbs = allDbs.filter(db => db.startsWith("userdb"));

  let promises = [];
  for (let db of filteredDbs) {
    promises.push(fetch(`${remoteHost}/${db}`, { method: "DELETE", headers }));
  }

  return Promise.all(promises);
}

function resetCouchDb(application) {
  const config = application.resolveRegistration("config:environment");
  const remoteHost = config.emberPouch.remoteHost;
  const couchHeaders = createHeaders(config);

  return Promise.all([deleteUsers(remoteHost, couchHeaders), deleteUsersDb(remoteHost, couchHeaders)]);
}

export { resetCouchDb };
