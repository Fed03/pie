const TestCommand = require("ember-cli/lib/commands/test");
const Docker = require("./Docker");

module.exports = TestCommand.extend({
  name: "pie:test",
  description: "Initializes external deps and tests the app",
  works: "insideProject",

  availableOptions: TestCommand.prototype.availableOptions.concat([
    { name: "docker-image", type: String, default: "fed03/couchdb:test", aliases: ["di"], description: "What docker images to pull" },
    { name: "docker-port", type: Number, default: 5984, aliases: ["dp"], description: "What docker port to expose" }
  ]),

  init() {
    this._super(...arguments);
    this.docker = new Docker();
  },

  async run(commandArgs) {
    process.env.PIE_DOCKER_PORT = commandArgs.dockerPort;

    await this.docker.runContainer(commandArgs);
    try {
      await TestCommand.prototype.run.call(this, ...arguments);
    } finally {
      await this.docker.removeContainer();
    }
  }
});
