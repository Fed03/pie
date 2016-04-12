import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('wallet', {
  default: {
    value: FactoryGuy.generate(() => faker.commerce.price())
  }
});
