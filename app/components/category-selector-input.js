import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['category-selector-input'],
  drawerOpened: false,
  isTesting: config.environment === 'test',
  click() {
    this.toggleProperty('drawerOpened');
  },
  actions: {
    categorySelected(category) {
      this.get('onSelection')(category);
    }
  }
});
