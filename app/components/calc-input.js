import Ember from 'ember';
import { currency } from "accounting/settings";

const opMapping = {
  plus: '+',
  minus: '-',
  multiply: '*',
  divide: '/'
};

export default Ember.Component.extend({
  classNames: ['calc-input'],
  symbol: currency.symbol,
  value: 0,
  playgroundValue: "",
  hasPendingOperation: false,
  init() {
    this._super(...arguments);

    this._appendToValue(this.get('value').toString());
  },
  actions: {
    numberClicked(number) {
      let expr = this.get('playgroundValue');
      if (expr.endsWith('0')) {
        let prev = expr.slice(0, -1);
        prev += number;
        this.set('playgroundValue', prev);
      } else {
        this._appendToValue(number);
      }
    },
    operation(type) {
      let opString = ` ${opMapping[type]} `;
      this._appendToValue(opString);
      this.set('hasPendingOperation', true);
    },
    commit() {
      const expr= this.get('playgroundValue');
      if (this.get('hasPendingOperation')) {
        const result = eval(expr);
        this.set('hasPendingOperation', false);
        this.set('playgroundValue', result);
      } else {
        this.get('onResult')(expr);
      }
    },
    reset() {
      this.set('hasPendingOperation', false);
      this.set('playgroundValue', "0");
    },
    delete() {
      let val = this.get('playgroundValue');
      this.set('playgroundValue', val.slice(0, -1));
    }
  },

  _appendToValue(string) {
    let val = this.get('playgroundValue');
    this.set('playgroundValue', val + string);
  }
});
