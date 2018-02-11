# PIE

A simple money tracking single page application

Author: **Federico Maria Teotini**    
Email: **teotini.federico@gmail.com**

## Progressive Web App (PWA)

In general, a **PWA** is a single page application written in Javascript that take advantage of some of the new HTML5 APIs to compete with native apps in term of:

* Performance
* Availability
* Functionality

PWAs are not *hybrid apps* compiled down to native languages such Objective-C or Java via frameworks like Apache Cordova, they are full blown web apps with URLs and so on that are executed under-the-hood by a browser. They work **Offline**, can be installed, have their icon and al the typical amenities of native apps. These features are made possible by a technology called **ServiceWorker** that can cache the apps, intercepts the network requests and provides others functionalities, all programmatically.

These features make PWAs the perfect choice for simple to complex apps with the additional benefit  of development ease. Since they are web page and run by a browser, there is no more the need to develop 3 copy of the same application (Web, Android, iOS) and, in the near future, they will be supported as first class citizens by Windows 10 as well.

PIE is born as a proof-of-concept application to explore PWA and its new technologies.

### Current state of PIE

At the moment of writing, PIE is not yet a PWA but it's written in order to be one of them pretty easily as the *progressive* in PWA suggests. 

In the following sections, I explain the technologies used pointing out their function in a PWA environment.

## Technologies and Tools

Pie is a single page application built on [Ember.js](https://www.emberjs.com/) and its wide ecosystem. It uses [PouchDB](https://pouchdb.com/) as a wrapper around **IndexedDB**, the local NoSQL database engine provided by the browsers. PouchDB is built to synchronize with a remote instance of [CouchDB](http://couchdb.apache.org/); during the development phase, CouchDB is hosted in a local [Docker](https://www.docker.com/) container.

The entire project has been built with TDD, writing first **acceptance tests** and then the **unit tests**. Ember.js and its tool are *test oriented* and describe the test typologies in the following way:

1. **Acceptance test**: Test the user interaction with the application and how it behaves in response. As such all the modules are integrated, no mocks are used.
2. **Integration test**: Test the components. Components are little pieces of UI with some logic. They follows the DDAU pattern (*Data Down Actions Up*) so they accept data as input, display it and use it in some way without modifying it, signal events to other modules (typically Controllers) through actions. These tests take care of testing these interactions and, also, user interactions with them.
3. **Unit tests**: Test various modules in isolation.

The app is written with code modularity and cleanness in mind (or, at least, I tried to). Great care has been used in naming in order to express the intent through the code; comments are rarely used. Tests should speak better than documentation. 

To achieve the true PWA experience, an architectural pattern called **app shell** has been followed. The app shell is what the app is made of besides the data. Every piece of the app that is not data can be cached by the ServiceWorker and served even offline through requests interception. When the app will be updated, we just tell the ServiceWorker to update its cache. Data, instead, is stored in the local IndexedDB.

The use of this pattern has been possible because of the architectural choices to separate the data layer from the rest of the app. 

###Ember.js

Ember.js is one of the most used Javascript framework shipping with all the functionalities expected in a full-featured web framework. It is built around the idiom "conventions over configurations" and it is based on one of the branches of the **MVC** design pattern. As such, there are Models, Templates, Controllers and Routes and Components to enhance them.

Ember.js provides **ember-cli**, a tool used to build, test  and serve the app. This powerful CLI tool is made to be extended; there are thousands of addons that augment what **ember-cli** can do. For example

* Code generators
* Deployment
* Build hooks

ember-cli allows also to install additional plugins for Ember.js, like CSS framework, APIs integration and so on.

Addons for ember-cli and plugins for Ember.js can be found on [EmberObserver](https://emberobserver.com/).

Ember.js and ember-cli are test oriented and provides the Testem test runner. They ship with QUnit as default test framework, but it can be swapped through addons to others framework like Mocha. In this project we relied on QUnit.

### PouchDB & CouchDB

PouchDB is a wrapper around IndexedDB, a NoSQL database hosted by the browser. As such it is always available, even offline. PouchDB simplifies the interactions with it and , in addition, it provides automatic synchronization with a remote CouchDB instance. Moreover, the entire PouchDB API mirrors the CouchDB one.

CouchDB is been used also as an auth server with the **couch-peruser** addon that, upon user registration, creates a brand new database for every user (a common pattern in the NoSQL world).

### Docker

Docker is used during development to serve the CouchDB instance. The `apache/couchdb:1.6.1-couchperuser` docker image has been modified to enable CORS through a custom image.

In addition, I created an addon for ember-cli that hooks itself into the test and serve commands and downloads the image, starts a container and finally destroys it.

## CI and Code Quality

The project is hosted publicly on [GitHub](https://github.com/Fed03/pie) and fully test on every push by Travis-CI with code coverage, enabled by the ember-cli-code-coverage addon, a wrapper around [istanbul](https://istanbul.js.org/), and analyzed by SonarQube.

The coverage and sonar reports are then automatically uploaded to [SonarCloud](https://sonarcloud.io/dashboard?id=fed03%3Apie%3Anew_version).

In the last phases of development, Sonar has been an invaluable tool to find inconsistencies, bugs, code smells and so on.