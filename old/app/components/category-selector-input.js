import Ember from 'ember';
import config from '../config/environment';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['category-selector-input'],
  classNameBindings: [
    'isFocused:category-selector-input-focused',
    'hasCategory:category-selector-input-full'
  ],

  isFocused: false,
  hasCategory: computed.bool('selectedCategory'),
  drawerOpened: computed.alias('isFocused'),
  isTesting: config.environment === 'test',
  actions: {
    categorySelected(category) {
      this.get('onSelection')(category);
      this.set('drawerOpened', false);
    },
    selectCategory() {
      this.toggleProperty('isFocused');
    }
  }
});
