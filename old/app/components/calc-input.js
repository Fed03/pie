import Ember from 'ember';
import { currency } from "accounting/settings";

const opMapping = {
  plus: '+',
  minus: '-',
  multiply: '*',
  divide: '/'
};

const keyMapping = Ember.A([
  {
    keyCode: [48, 96],
    type: 'number',
    value: "0"
  },
  {
    keyCode: [49, 97],
    type: 'number',
    value: "1"
  },
  {
    keyCode: [50, 98],
    type: 'number',
    value: "2"
  },
  {
    keyCode: [51, 99],
    type: 'number',
    value: "3"
  },
  {
    keyCode: [52, 100],
    type: 'number',
    value: "4"
  },
  {
    keyCode: [53, 101],
    type: 'number',
    value: "5"
  },
  {
    keyCode: [54, 102],
    type: 'number',
    value: "6"
  },
  {
    keyCode: [55, 103],
    type: 'number',
    value: "7"
  },
  {
    keyCode: [56, 104],
    type: 'number',
    value: "8"
  },
  {
    keyCode: [57, 105],
    type: 'number',
    value: "9"
  },
  {
    keyCode: [110, 190],
    type: 'decimal',
    value: "."
  },
  {
    keyCode: [107, 187],
    type: 'operation',
    value: "plus"
  },
  {
    keyCode: [109, 189],
    type: 'operation',
    value: "minus"
  },
  {
    keyCode: [106, 221],
    type: 'operation',
    value: "multiply"
  },
  {
    keyCode: [191, 111],
    type: 'operation',
    value: "divide"
  },
  {
    keyCode: [8],
    type: 'delete'
  },
  {
    keyCode: [46],
    type: 'reset'
  },
  {
    keyCode: [13],
    type: 'calc'
  }
]);

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

  didInsertElement() {
    this.$('.calc-input--playground input').focus().on('keydown', this._handleKey.bind(this));
  },

  actions: {
    numberClicked(number) {
      this._appendNumber(number);
    },
    operation(type) {
      this._addOperation(type);
    },
    commit() {
      this._commit();
    },
    reset() {
      this._reset();
    },
    delete() {
      this._delete();
    },
    decimal() {
      this._appendDecimalPoint();
    }
  },

  _appendNumber(number) {
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
  _addOperation(type) {
    if (! this._lastCharIsOp()) {
      let opChar = opMapping[type];

      this.get('playgroundExpr').pushObject(opChar);
      this.set('hasPendingOperation', true);
    }
  },
  _appendDecimalPoint() {
    if (! this._lastCharIsOp()) {
      let val = this.get('playgroundValue');
      this.set('playgroundValue', val + '.');
    }
  },
  _delete() {
    if (! this._lastCharIsZero()) {
      let val = this.get('playgroundValue').slice(0, -1);
      if (val.length === 0) {
        this.set('playgroundValue', '0');
      } else {
        this.set('playgroundValue', val);
      }
    }
  },
  _reset() {
    this.set('hasPendingOperation', false);
    this.set('playgroundExpr', Ember.A(["0"]));
  },
  _commit() {
    const expr = this.get('playgroundValue');
    if (this.get('hasPendingOperation') && !this._lastCharIsOp()) {
      const result = eval(expr);
      this.set('hasPendingOperation', false);
      this.set('playgroundExpr', Ember.A([result.toString()]));
    } else {
      this.get('onResult')(Number(expr));
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
  },

  _handleKey(event) {
    let key = keyMapping.find(item => {
      return item.keyCode.contains(event.keyCode);
    });
    if (key) {
      event.preventDefault();
      switch (key.type) {
        case 'number':
          this._appendNumber(key.value);
          break;
        case 'decimal':
          this._appendDecimalPoint();
          break;
        case 'operation':
          this._addOperation(key.value);
          break;
        case 'delete':
          this._delete();
          break;
        case 'reset':
          this._reset();
          break;
        case 'calc':
          this._commit();
          break;
      }
    }
  }
});
