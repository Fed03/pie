import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('fillTransactionValue', function(app, number) {
  click('[data-test-selector=transaction-value]').then(() => {
    let digits = number.toString().split('');
    digits.forEach(digit => {
      click(`.calc-input button[data-number=${digit}]`);
    });
    click('.calc-input .calc-input--commit-btn');
  });
});