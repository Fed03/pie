import Ember from "ember";

export default Ember.Component.extend({
  "data-test-category-selector-input": true,
  classNames: ["category-selector-input"],
  classNameBindings: ["focused"],
  focused: false,

  actions: {
    selectCategory() {
      this.sendAction("onClick");
      this.toggleProperty("focused");
    }
  }
});
