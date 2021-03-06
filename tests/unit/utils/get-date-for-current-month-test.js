import getDateForCurrentMonth from 'pie/utils/get-date-for-current-month';
import { module, test } from 'qunit';

module('Unit | Utility | get date for current month');

test('it returns the current month/year with day=1 and h,m,s,ms=0', function(assert) {
  let result = getDateForCurrentMonth();

  let expected = new Date();
  expected.setDate(1);
  expected.setHours(0,0,0,0);

  assert.deepEqual(result, expected, 'The Date obj has day:1 and h,m,s,ms:0');
});
