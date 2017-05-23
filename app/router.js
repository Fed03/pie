import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('months', { path: '/' }, function() {
    this.route('view', { path: ':month_id' });
  });
  
  this.route('transaction', { path: 'transactions/:transaction_id' });
  this.route('create-transaction', { path: 'transactions/create' });
  this.route('setup');
});

export default Router;
