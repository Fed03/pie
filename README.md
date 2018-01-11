# Pie [![Build Status](https://travis-ci.org/Fed03/pie.svg?branch=new_version)](https://travis-ci.org/Fed03/pie)

Pie is a simple money tracker app built with the PWA mantra in mind. It's not yet a full blown PWA (it does not work offline) but its structure allows that evolution.

## Prerequisites

You will need the following things properly installed on your computer.

* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/) - Version 8 LTS
* [Yarn](https://yarnpkg.com/)
* [Google Chrome](https://google.com/chrome/)

### Note for Windows User

When testing, the app connects to Docker daemon via its remote API using an unsecured TCP connection. On Windows we need to activate this option in the Docker settings panel.

## Installation

* `git clone <repository-url>` this repository
* `cd pie`
* `yarn install`

## Running / Testing

After installation you can access the development version of the app calling

`yarn start`

The build tool will download the Docker image, start a container, build the app and serve it:

* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

If you just want to run the tests, you can by calling

* `yarn test`
* `yarn test --server`
