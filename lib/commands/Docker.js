const Dockerode = require("dockerode");
const Ora = require("ora");
const streamToPromise = require("stream-to-promise");
const chalk = require("chalk");

const { log } = console;

class Docker {
  constructor() {
    this.docker = new Dockerode(this._platformOptions());
  }

  async runContainer(options) {
    try {
      let image = await this._getImage(options.dockerImage);
      this.container = await this._runContainer(image, options.dockerPort);
      return this.container;
    } catch (e) {
      if (e.code === "ECONNREFUSED") {
        log(chalk.bold.red("Cannot find Docker!\nMaybe it's not running"));
        return Promise.reject();
      }
      throw e;
    }
  }

  removeContainer() {
    return this.container.stop().then(container => container.remove());
  }

  async _getImage(imageName) {
    const alreadyPresent = await this._imageAlreadyOnServer(imageName);
    if (!alreadyPresent) {
      await this._pullImage(imageName);
    }

    return imageName;
  }

  _runContainer(imageName, port) {
    const promise = this.docker
      .createContainer({
        Image: imageName,
        ExposedPorts: {
          "5984/tcp": {}
        },
        HostConfig: {
          PortBindings: {
            "5984/tcp": [{ HostPort: String(port) }]
          }
        }
      })
      .then(container => container.start());

    Ora.promise(promise, {
      text: chalk.green("Starting container..."),
      color: "green",
      stream: process.stdout
    });

    return promise;
  }

  async _imageAlreadyOnServer(imageName) {
    try {
      await this.docker.getImage(imageName).inspect();
      return true;
    } catch (e) {
      return false;
    }
  }

  _pullImage(imageName) {
    return this.docker.pull(imageName).then(stream => {
      let promise = streamToPromise(stream);
      Ora.promise(promise, {
        text: chalk.green("Downloading the Docker Image..."),
        color: "green",
        stream: process.stdout
      });
      return promise;
    });
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
}

module.exports = Docker;
