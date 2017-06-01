import { currency } from "accounting/settings";

export function initialize() {
  currency.symbol = '€';
  currency.format = '%s %v';
}

export default {
  name: 'accountingjs',
  initialize
};
