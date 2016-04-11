import { currency } from "accounting/settings";

export function initialize() {
  currency.symbol = '€';
  currency.format = {
    pos: "%s +%v",
    neg: "%s -%v",
    zero: "%s %v"
  };
}

export default {
  name: 'accountingjs',
  initialize
};
