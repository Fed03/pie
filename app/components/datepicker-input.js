import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    this.$('.pika-single').appendTo(this.$('.pikaday-overlay'));
  }
});
