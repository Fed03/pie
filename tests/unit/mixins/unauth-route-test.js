import Ember from 'ember';
import UnauthRouteMixin from 'pie/mixins/unauth-route';
import { module, test } from 'qunit';

module('Unit | Mixin | unauth route');

// Replace this with your real tests.
test('it works', function(assert) {
  let UnauthRouteObject = Ember.Object.extend(UnauthRouteMixin);
  let subject = UnauthRouteObject.create();
  assert.ok(subject);
});
