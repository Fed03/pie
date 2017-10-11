import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  "data-test-calculator-display": true,
  classNames: ["calculator-display"],
  formattedValue: computed("value", {
    get() {
      let value = isPresent(this.get("value")) ? this.get("value") : "0";
      let formattedValue = parseFloat(value).toLocaleString("en-US");

      const match = value.match(/\.\d*?(0*)$/);
      if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

      return formattedValue;
    }
  }).readOnly()
});
