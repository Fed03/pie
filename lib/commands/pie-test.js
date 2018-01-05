const Command = require("ember-cli/lib/models/command");
const Docker = require("./Docker");

module.exports = Command.extend({
  name: "pie:test",
  description: "Initializes externa deps and tests the app",
  works: "insideProject",

  availableOptions: [
    { name: "docker-image", type: String, default: "fed03/couchdb:test", aliases: ["di"], description: "What docker images to pull" },
    { name: "docker-port", type: Number, default: 5984, aliases: ["dp"], description: "What docker port to expose" }
  ],

  async run(commandArgs) {
    let docker = new Docker();
    await docker.runContainer(commandArgs);

    await docker.removeContainer();
  }
});
