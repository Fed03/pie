import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import sinon from 'sinon';

const {
  RSVP: {
    Promise
  }
} = Ember;

let saveMonthSpy;

function getDateForCurrentMonth() {
  let currentMonth = new Date();
  currentMonth.setUTCDate(1);
  currentMonth.setUTCHours(0,0,0,0);

  return currentMonth;
}

const month = Ember.Object.extend({
  date: null,
  save() {
    return Promise.resolve(this);
  },
  init() {
    this.set('date', getDateForCurrentMonth());
  }
});

let storeStub = Ember.Service.extend({
  months: Ember.A([]),
  newMonth: null,
  init() {
    this._super(...arguments);
    let newMonth = month.create();
    saveMonthSpy = sinon.spy(newMonth, 'save');
    this.set('newMonth', newMonth);
  },
  findAll() {
    return Promise.resolve(this.get('months'));
  },
  createRecord() {
    return this.get('newMonth');
  }
});

moduleFor('service:month-retrieve-service', 'Unit | Service | month retrieve service', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo'],
  beforeEach() {
    this.register('service:store', storeStub);
    this.inject.service('store', { as: 'store' });
  }
});

test('the findCurrentMonth method returns a promise', function(assert) {
  let service = this.subject();
  assert.ok(service.findCurrentMonth() instanceof Promise, 'It\'s a Promise');
});

test('it creates a new month if current month is not found in the store', function(assert) {
  let service = this.subject();
  let createRecordSpy = sinon.spy(service.get('store'), 'createRecord');

  let result = service.findCurrentMonth();

  result.then(newMonth => {
    assert.deepEqual(newMonth.get('date'), getDateForCurrentMonth());
    assert.ok(createRecordSpy.calledWithExactly('month'));
    assert.ok(saveMonthSpy.calledOnce);
  });
});

test('it returns the correct month if found in store', function(assert) {
  let service = this.subject();
  let currentMonth = month.create();
  service.get('store.months').push(currentMonth);
  let createRecordSpy = sinon.spy(service.get('store'), 'createRecord');

  let result = service.findCurrentMonth();

  result.then(month => {
    assert.deepEqual(month, currentMonth);
    assert.equal(createRecordSpy.callCount, 0);
    assert.equal(saveMonthSpy.callCount, 0);
  });
});
