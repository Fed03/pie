import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('transaction', {
  default: {
    description: FactoryGuy.generate(() => faker.commerce.product()),
    value: FactoryGuy.generate(() => faker.commerce.price()),
    category: FactoryGuy.belongsTo('category')
  },
  traits: {
    yesterday: {
      date: () => {
        const yesterday = new Date();
        yesterday.setUTCHours(0,0,0,0);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        return yesterday;
      }
    }
  }
});
