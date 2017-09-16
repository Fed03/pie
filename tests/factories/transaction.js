import FactoryGuy from "ember-data-factory-guy";
import faker from "faker";

FactoryGuy.define("transaction", {
  default: {
    description: FactoryGuy.generate(() => faker.commerce.product()),
    value: FactoryGuy.generate(() => faker.commerce.price()),
    category: FactoryGuy.belongsTo("category"),
    date: new Date()
  },
  traits: {
    yesterday: {
      date: () => {
        const yesterday = new Date();
        yesterday.setHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      }
    }
  }
});
