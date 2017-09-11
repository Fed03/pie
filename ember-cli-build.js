/* eslint-env node */
"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ["node_modules/muicss/lib/sass"]
    },
    nodeAssets: {
      muicss: {
        srcDir: "dist",
        import: ["js/mui.min.js"]
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

  app.import("bower_components/Faker/build/build/faker.min.js", {
    using: [{ transformation: "amd", as: "faker" }]
  });

  return app.toTree();
};
