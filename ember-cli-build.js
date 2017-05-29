/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    nodeAssets: {
      'muicss': {
        srcDir: 'dist',
        import: ['css/mui.min.css', 'js/mui.min.js']
      }
    }
  });

  return app.toTree();
};
