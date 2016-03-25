import abbreviateSentence from 'offline-app/utils/abbreviate-sentence';
import { module, test } from 'qunit';

module('Unit | Utility | abbreviate sentence');

test('it returns the first letter and first consonant of a word',
function(assert) {
  let result = abbreviateSentence('food');
  assert.equal(result, 'fd', '`food` is abbreviated in `fd`');

  result = abbreviateSentence('love');
  assert.equal(result, 'lv', '`love` is abbreviated in `lv`');
});

test('it returns only the first letter of a word if its length is 1',
function(assert) {
  let result = abbreviateSentence('l');
  assert.equal(result, 'l', '`l` is abbreviated in `l`');
});

test('if the sentence has 2 words, it returns the first letter of every word',
function(assert) {
  let result = abbreviateSentence('lorem ipsum');
  assert.equal(result, 'li', '`lorem ipsum` is abbreviated in `li`');
});
