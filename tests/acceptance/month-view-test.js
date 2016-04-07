import { test } from 'qunit';
import moduleForAcceptance from 'offline-app/tests/helpers/module-for-pouch-acceptance';

moduleForAcceptance('Acceptance | month view', {
  beforeEach() {
    return create('month').then(month => {
      this.currentMonth = month;
      return month;
    });
  }
});

test('viewing a month without transaction wil result in an empty page', function(assert) {
  visit(`/months/${this.currentMonth.get('id')}`);

  andThen(function() {
    assert.ok(
      findWithAssert('.transactions-container').text().trim().split(' ').join(' '),
      "No transactions. Add (+) some!"
    );
    assert.equal(find('.transaction-panel').length, 0);
  });
});
