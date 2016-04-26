/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'offline-app',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.emberPouch = {
      localDb: 'local_pie_db',
      remoteDb: 'https://couchdb.eukaryot.com/local_pie_db'
    };
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.emberPouch = {
      localDb: 'testing'
    };
  }

  if (environment === 'production') {
    ENV.emberPouch = {
      localDb: 'pie_db',
      remoteDb: 'https://couchdb.eukaryot.com/pie_db'
    };
  }

  return ENV;
};
