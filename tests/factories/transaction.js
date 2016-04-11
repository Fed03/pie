import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('transaction', {
  default: {
    description: FactoryGuy.generate(() => faker.commerce.product()),
    value: FactoryGuy.generate(() => faker.commerce.price()),
    category: FactoryGuy.belongsTo('category')
  }
});
