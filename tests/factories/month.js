import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('month', {
  default: {
    date: FactoryGuy.generate(() => {
      let date = faker.date.past();
      date.setUTCDate(1);
      date.setUTCHours(0,0,0,0);
      return date;
    })
  },
  currentMonth: {
    date: FactoryGuy.generate(() => {
      let date = new Date();
      date.setUTCDate(1);
      date.setUTCHours(0,0,0,0);
      return date;
    })
  }
});
