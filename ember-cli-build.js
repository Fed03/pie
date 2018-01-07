/* eslint-env node */
"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const cjsToEs6 = require("broccoli-cjs-to-es6");
const Funnel = require("broccoli-funnel");

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    trees: {
      vendor: cjsToEs6(new Funnel("vendor"), {
        modules: ["pouchdb-authentication"],
        outputFile: "pouchdb-authentication.js"
      })
    },
    sassOptions: {
      includePaths: ["node_modules/muicss/lib/sass"]
    },
    nodeAssets: {
      muicss: {
        srcDir: "dist",
        import: ["js/mui.js"]
      },
      "roboto-fontface": {
        import: ["css/roboto/roboto-fontface.css"],
        public: {
          destDir: "/",
          include: ["fonts/roboto/*"]
        }
      }
    },
    "ember-cli-babel": {
      includePolyfill: true
    }
  });

  app.import("vendor/pouchdb-authentication.js");

  app.import("node_modules/@bower_components/Faker/build/build/faker.min.js", {
    using: [{ transformation: "amd", as: "faker" }]
  });

  return app.toTree();
};
