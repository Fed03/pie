import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectedCategory(category) {
      this.get('onSelection')(category);
    }
  }
});
