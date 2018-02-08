# PIE

A simple money tracking single page application

Author: **Federico Maria Teotini**    
Email: **teotini.federico@gmail.com**

## Progressive Web App (PWA)

In general, a **PWA** is a single page application written in Javascript that take advantage of some of the new HTML5 APIs to compete with native apps in term of:

* Performance
* Availability
* Functionality

PWAs are not *hybrid apps* compiled down to native languages such Objective-C or Java via frameworks like Apache Cordova, they are full blown web apps with URLs and so on that are executed under-the-hood by a browser. They work **Offline**, can be installed, have their icon and al the typical amenities of native apps.

These features make PWAs the perfect choice for simple to complex apps with the additional benefit  of development ease. Since they are web page and run by a browser, there is no more the need to develop 3 copy of the same application (Web, Android, iOS) and, in the near future, they will be supported as first class citizens by Windows 10 as well.

PIE is born as a proof-of-concept application to explore PWA and its new technologies.

### Current state of PIE

At the moment of writing, PIE is not yet a PWA but it's written in order to be one of them pretty easily as the *progressive* in PWA suggests. 

In the following sections, I explain the technologies used pointing out their function in a PWA environment.

## Technologies and Tools

Pie is a single page application built on [Ember.js](https://www.emberjs.com/) and its wide ecosystem. It uses [PouchDB](https://pouchdb.com/) as wrapper around **IndexedDB**, the local NoSQL database engine provided by the browsers. PouchDB is built to synchronize with a remote instance of [CouchDB](http://couchdb.apache.org/); during the development phase, CouchDB is hosted in a local [Docker](https://www.docker.com/) container.

###Ember.js

Ember.js is one of the most used Javascript framework shipping with all the functionalities expected in a full-featured web framework. It is built around the idiom "conventions over configurations" and it is based on one of the branches of the MVC design pattern. As such, there are Models, Templates, Controllers and Routes and Components to enhance them.

Ember.js provides **ember-cli**, a tool used to build, test  and serve the app. This powerful CLI tool is made to be extended; there are thousands of addons that augment what **ember-cli** can do. For example

* Code generators
* Deployment
* Build hooks

ember-cli allows also to install additional plugins for Ember.js, like CSS framework, APIs integration and so on.

Addons for ember-cli and plugins for Ember.js can be found on [EmberObserver](https://emberobserver.com/).

### PouchDB & CouchDB

as a matter of fact, the entire PouchDB API mirrors the CouchDB one.