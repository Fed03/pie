import Ember from 'ember';
import abbreviateSentence from '../utils/abbreviate-sentence';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['category--badge'],
  classNameBindings: ['typeClass'],
  typeClass: computed('category.type', {
    get() {
      return `category--badge-${this.get('category.type')}`;
    }
  }),
  abbreviation: computed('category.name', {
    get() {
      return abbreviateSentence(this.get('category.name')).toLowerCase();
    }
  })
});
