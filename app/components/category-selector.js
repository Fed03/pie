import Ember from "ember";
import { groupBy, sort } from "ember-awesome-macros/array";
import raw from "ember-macro-helpers/raw";

export default Ember.Component.extend({
  "data-test-category-selector": true,
  classNames: ["category--selector"],
  categoriesByType: groupBy(sort("categories", ["name"]), raw("type")),
  actions: {
    selectedCategory(category) {
      this.get("onSelection")(category);
    }
  }
});
