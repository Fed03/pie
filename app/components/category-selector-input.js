import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['category-selector-input'],
  drawerOpened: false,
  click() {
    this.toggleProperty('drawerOpened');
  }
});
