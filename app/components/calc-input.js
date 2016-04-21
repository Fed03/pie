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
  hasPendingOperation: false,

  playgroundValue: Ember.computed('playgroundExpr.[]', {
    get() {
      return this.get('playgroundExpr').join(' ');
    },
    set() {
      const newValue = arguments[1];
      this.set('playgroundExpr', Ember.A(newValue.split(' ')));
      return newValue;
    }
  }),
  lastChar: Ember.computed.oneWay('playgroundExpr.lastObject'),

  init() {
    this._super(...arguments);

    // this.set('lastChar', this.get('value').toString());
    // this._appendToValue(this.get('value').toString());
    let playgroundExpr = Ember.A([]);
    playgroundExpr.pushObject(this.get('value').toString());
    this.set('playgroundExpr', playgroundExpr);
  },

  actions: {
    numberClicked(number) {
      let expr = this.get('playgroundExpr');
      if (this._lastCharIsOp()) {
        expr.pushObject(number);
      } else if (this._lastCharIsZero() && this.get('playgroundValue').length === 1) {
        let prev = expr.slice(0, -1);
        prev.pushObject(number);
        this.set('playgroundExpr', prev);
      } else if (this._lastCharIsNumber()) {
        let last = expr.pop();
        expr.pushObject(last + number);
      }
    },
    operation(type) {
      if (! this._lastCharIsOp()) {
        let opChar = opMapping[type];

        this.get('playgroundExpr').pushObject(opChar);
        this.set('hasPendingOperation', true);
      }
    },
    commit() {
      const expr = this.get('playgroundValue');
      if (this.get('hasPendingOperation') && !this._lastCharIsOp()) {
        const result = eval(expr);
        this.set('hasPendingOperation', false);
        this.set('playgroundExpr', Ember.A([result.toString()]));
      } else {
        this.get('onResult')(expr);
      }
    },
    reset() {
      this.set('hasPendingOperation', false);
      this.set('playgroundExpr', Ember.A(["0"]));
    },
    delete() {
      if (! this._lastCharIsZero()) {
        let val = this.get('playgroundValue').slice(0, -1);
        if (val.length === 0) {
          this.set('playgroundValue', '0');
        } else {
          this.set('playgroundValue', val);
        }
      }
    },
    decimal() {
      if (! this._lastCharIsOp()) {
        let val = this.get('playgroundValue');
        this.set('playgroundValue', val + '.');
      }
    }
  },

  _lastCharIsOp() {
    const ops = ['+', '-', '*', '/'];
    return ops.contains(this.get('lastChar'));
  },
  _lastCharIsNumber() {
    return !isNaN(this.get('lastChar'));
  },
  _lastCharIsZero() {
    return this.get('lastChar') === '0';
  }
});
