import EmberRouter from '@ember/routing/router';
import config from "./config/environment";

const Router = EmberRouter.extend({
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

  this.route("signup");
});

export default Router;
