import Ember from 'ember';

export default Ember.Component.extend({
  filteredCategories: Ember.Object.create(),
  actions: {
    selectedCategory(category) {
      this.get('onSelection')(category);
    }
  },
  didReceiveAttrs() {
    this._super(...arguments);
    this._initCategoryProperties();
  },
  _initCategoryProperties() {
    let categoryTypes = this.get('categories').reduce((types, category) => {
      types.push(category.get('type'));
      return types;
    }, Ember.A([])).uniq();

    categoryTypes.forEach(type => {
      let categories = this.get('categories').filterBy('type', type);
      this.get(`filteredCategories`).set(type, categories);
    });

    this.set('categoryTypes', categoryTypes);
  }
});
