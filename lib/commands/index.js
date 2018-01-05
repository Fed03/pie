/* eslint-env node */
"use strict";
const pieTest = require("./pie-test");
const pieServe = require("./pie-serve");

module.exports = {
  name: "commands",

  includedCommands() {
    return {
      pieTest,
      pieServe
    };
  }
};
