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

  run(commandArgs) {
    let superMethod = this._super.bind(this, ...arguments);
    return this.docker
      .runContainer(commandArgs)
      .then(() => superMethod())
      .then(() => this.docker.removeContainer());
  },

  onInterrupt() {
    return this.docker.removeContainer();
  }
});
