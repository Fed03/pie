import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("months", { path: "/" }, function() {
    this.route("view", { path: "months/:month_id" });
  });

  this.route("transactions", function() {
    this.route("view", { path: ":transaction_id" });
    this.route("create");
  });

  // this.route('login');
  this.route("signup");
});

export default Router;
