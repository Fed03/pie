import Component from '@ember/component';

export default Component.extend({
  "data-test-category-selector-input": true,
  classNames: ["category-selector-input"],
  classNameBindings: ["focused"],
  focused: false,

  click() {
    this.sendAction("onClick");
    this.toggleProperty("focused");
  }
});
