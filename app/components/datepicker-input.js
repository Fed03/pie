/* globals Pikaday */
import Ember from 'ember';
import PikadayInput from 'ember-pikaday/components/pikaday-input';
import moment from 'moment';

export default PikadayInput.extend({
  attributeBindings: ['value'],
  _options: Ember.computed('options', {
    get() {
      const firstDay = this.get('firstDay');
      let defaultOptions = {
        field: this.element,
        onOpen: Ember.run.bind(this, this.onPikadayOpen),
        onClose: Ember.run.bind(this, this.onPikadayClose),
        onSelect: Ember.run.bind(this, this.onPikadaySelect),
        onDraw: Ember.run.bind(this, this.onPikadayRedraw),
        firstDay: (typeof firstDay !== 'undefined') ? parseInt(firstDay, 10) : 1,
        format: this.get('format') || 'DD.MM.YYYY',
        yearRange: this.determineYearRange(),
        minDate: this.get('minDate') || null,
        maxDate: this.get('maxDate') || null,
        theme: this.get('theme') || null
      };
      if (this.get('i18n')) {
        defaultOptions.i18n = this.get('i18n');
      }
      Ember.merge(defaultOptions, this.get('options') || {});
      return defaultOptions;
    }
  }),
  setupPikaday() {
    var pikaday = new Pikaday(this.get('_options'));

    this.set('pikaday', pikaday);
    this.setPikadayDate();
  },
  didInsertElement() {
    this._super(...arguments);
    this.setupPikaday();
  },
  didUpdateAttrs({ newAttrs }) {
    this._super(...arguments);
    this.setPikadayDate();
    this.setMinDate();
    this.setMaxDate();
    if(newAttrs.options) {
      this.updateOptions();
    }
  },
  didRender() {
    this._super(...arguments);
    this.autoHideOnDisabled();
  },
  updateOptions() {
    this.get('pikaday').config(this.get('_options'));
  },
  userSelectedDate: function() {
    var selectedDate = this.get('pikaday').getDate();

    if (this.get('useUTC')) {
      selectedDate = moment.utc([selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()]).toDate();
    }

    this.get('onSelection')(selectedDate);
  },
  autoHideOnDisabled() {
    if (this.get('disabled') && this.get('pikaday')) {
      this.get('pikaday').hide();
    }
  }
});
