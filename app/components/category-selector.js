import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Component.extend({
  classNames: ['category--selector'],
  categoriesByType: groupBy('categories', 'type'),
  actions: {
    selectedCategory(category) {
      this.get('onSelection')(category);
    }
  }
});
