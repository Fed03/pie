import Ember from "ember";
import config from "pie/config/environment";

export default Ember.Component.extend({
  "data-test-category-selector-input": true,
  classNames: ["category-selector-input"],
  classNameBindings: [
    "isFocused:category-selector-input-focused",
    "hasCategory:category-selector-input-full"
  ],

  isTesting: config.environment === "test",
  hasCategory: Ember.computed.bool("selectedCategory"),
  drawerOpened: Ember.computed.alias("isFocused"),
  isFocused: false,

  actions: {
    categorySelected(category) {
      this.get("onSelection")(category);
      this.set("drawerOpened", false);
    },
    selectCategory() {
      this.toggleProperty("isFocused");
    }
  }
});
