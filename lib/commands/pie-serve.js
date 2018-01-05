const ServeCommand = require("ember-cli/lib/commands/serve");
const Docker = require("./Docker");

module.exports = ServeCommand.extend({
  name: "pie:serve",
  description: "Initializes external deps and serves the app",
  works: "insideProject",

  availableOptions: ServeCommand.prototype.availableOptions.concat([
    { name: "docker-image", type: String, default: "fed03/couchdb:test", aliases: ["di"], description: "What docker images to pull" },
    { name: "docker-port", type: Number, default: 5984, aliases: ["dp"], description: "What docker port to expose" }
  ]),

  init() {
    this._super(...arguments);
    this.docker = new Docker();
  },

  async run(commandArgs) {
    process.env.PIE_DOCKER_PORT = String(commandArgs.dockerPort);

    await this.docker.runContainer(commandArgs);
    try {
      await ServeCommand.prototype.run.call(this, ...arguments);
    } finally {
      await this.docker.removeContainer();
    }
  }
});
