import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import "./create";
import "./create-list";
import "./find-latest-in-db";
import { run } from '@ember/runloop';

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
