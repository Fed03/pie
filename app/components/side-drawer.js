import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'aside',
  classNames: ['sidedrawer'],
  classNameBindings: ['positionClass'],
  position: 'left',
  isOpen: true,
  bodyEl: document.getElementsByTagName('body')[0],

  positionClass: computed('position', {
    get() {
      return `sidedrawer-${this.get('position')}-positioned`;
    }
  }),

  didRender() {
    this.$().siblings().addClass('sidedrawer-sibling');
    this._setTopProperty();
    this._setSiblingClasses();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._toggleVisibility();
  },

  _toggleVisibility() {
    const body = this.get('bodyEl');
    if (this.get('isOpen')) {
      body.classList.remove('sidedrawer-closed');
      body.classList.add('sidedrawer-opened');
    } else {
      body.classList.remove('sidedrawer-opened');
      body.classList.add('sidedrawer-closed');
    }
  },

  _setTopProperty() {
    const parentPosition = this.$().parent().position();
    this.$().css({
      top: parentPosition.top
    });
  },

  _setSiblingClasses() {
    this.$().siblings().addClass('sidedrawer-sibling')
      .addClass(`sidedrawer-sibling-${this.get('position')}`);
  }
});
