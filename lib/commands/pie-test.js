const Command = require("ember-cli/lib/models/command");
const Dockerode = require("dockerode");
const Ora = require("ora");
const streamToPromise = require("stream-to-promise");
const chalk = require("chalk");

const { log } = console;

class Docker {
  constructor() {
    this.docker = new Dockerode(this._platformOptions());
  }

  async pullImage(imageName) {
    const alreadyPresent = await this._imageAlreadyOnServer(imageName);
    if (!alreadyPresent) {
      return this._execOp(() => {
        return this.docker.pull(imageName).then(stream => {
          let promise = streamToPromise(stream);
          Ora.promise(promise, {
            text: chalk.green("Downloading the Docker Image..."),
            color: "green",
            stream: process.stdout
          });
          return promise;
        });
      });
    }
  }

  async _imageAlreadyOnServer(imageName) {
    try {
      await this._execOp(() => this.docker.getImage(imageName).inspect());
      return true;
    } catch (e) {
      return false;
    }
  }

  _platformOptions() {
    const isWindows = /^win/.test(process.platform);
    if (isWindows) {
      return {
        host: "127.0.0.1",
        port: 2375
      };
    }

    return {
      socketPath: "/var/run/docker.sock"
    };
  }

  _execOp(promise) {
    return promise().catch(e => {
      if (e.code === "ECONNREFUSED") {
        log(chalk.bold.red("Cannot find Docker!\nMaybe it's not running"));
        process.exit(1);
      } else {
        throw e;
      }
    });
  }
}

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
    await docker.pullImage(commandArgs.dockerImage);
  }
});
