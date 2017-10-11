import Component from '@ember/component';
import { computed } from '@ember/object';
import abbreviateSentence from '../utils/abbreviate-sentence';

export default Component.extend({
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
