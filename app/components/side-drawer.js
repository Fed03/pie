import Ember from "ember";

const { computed } = Ember;

export default Ember.Component.extend({
  "data-test-sidedrawer": true,
  tagName: "aside",
  classNames: ["sidedrawer"],
  classNameBindings: ["positionClass", "visibility"],
  position: "left",
  isOpen: true,
  visibility: computed("isOpen", {
    get() {
      return this.get("isOpen") ? "sidedrawer-opened" : "sidedrawer-closed";
    }
  }),

  positionClass: computed("position", {
    get() {
      return `sidedrawer-${this.get("position")}-positioned`;
    }
  })

  // $parent: computed("parentSelector", {
  //   get() {
  //     const parent = Ember.$(this.get("parentSelector"));
  //     return parent.length ? parent : Ember.$(this.element).parent();
  //   }
  // }),
  //
  // $sibling: computed("$parent", {
  //   get() {
  //     return this.get("$parent").children(".sidedrawer-sibling");
  //   }
  // }),

  // didInsertElement() {
  //   this._super(...arguments);
  //
  //   this._setTopCssProperty();
  //   this._setSiblingPositionClass();
  //   this._toggleSiblingVisibility();
  // },
  //
  // didUpdate() {
  //   this._super(...arguments);
  //   this._setSiblingPositionClass();
  //   this._toggleSiblingVisibility();
  // },
  //
  // _setTopCssProperty() {
  //   const parentPosition = this.get("$parent").position();
  //   this.$().css({
  //     top: parentPosition.top
  //   });
  // },
  //
  // _setSiblingPositionClass() {
  //   this.get("$sibling")
  //     .addClass("sidedrawer-sibling")
  //     .addClass(`sidedrawer-sibling-${this.get("position")}`);
  // },
  //
  // _toggleSiblingVisibility() {
  //   let sibling = this.get("$sibling");
  //   if (this.get("isOpen")) {
  //     sibling.addClass("sidedrawer-sibling-opened");
  //   } else {
  //     sibling.removeClass("sidedrawer-sibling-opened");
  //   }
  // }
});
