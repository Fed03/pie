import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: true,
  actions: {
    dateSelected() {
      this.get('onSelection')(...arguments);
    }
  },
  didInsertElement() {
    this.$('.pika-single').appendTo(this.$('.pikaday-overlay'));
  },
  click(event) {
    event.preventDefault();
    if (this._isAllowedTarget(event)) {
      this.toggleProperty('isHidden');
    }
  },
  _isAllowedTarget(event) {
    return  event.target === this.$('input')[0] ||
            event.target === this.$('.pika-pika')[0] ||
            event.target === this.$('button.pika-ok')[0];

  }
});
