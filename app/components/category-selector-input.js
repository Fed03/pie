import Ember from "ember";
import config from "pie/config/environment";

export default Ember.Component.extend({
  "data-test-category-selector-input": true,
  classNames: ["category-selector-input"],
  classNameBindings: ["focused"],

  isTesting: config.environment === "test",
  drawerOpened: Ember.computed.alias("focused"),
  focused: false,

  actions: {
    categorySelected(category) {
      this.get("onSelection")(category);
      this.set("drawerOpened", false);
    },
    selectCategory() {
      this.toggleProperty("focused");
    }
  }
});
