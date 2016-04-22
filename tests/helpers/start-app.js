import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './create-list';
import './create';
import './find-latest-in-db';
import './fill-transaction-value';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
