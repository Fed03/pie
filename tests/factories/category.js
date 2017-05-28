import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('category', {
  polymorphic: false,
  default: {
    name: FactoryGuy.generate(() => {
      return faker.commerce.department();
    }),
    type: FactoryGuy.generate(() => {
      return faker.random.arrayElement(['income', 'outcome']);
    })
  }
});
