/* eslint-env node */
"use strict";
const pieTest = require("./pie-test");

module.exports = {
  name: "commands",

  includedCommands() {
    return {
      pieTest
    };
  }
};
