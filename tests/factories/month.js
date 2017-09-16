import FactoryGuy from "ember-data-factory-guy";
import faker from "faker";

FactoryGuy.define("month", {
  default: {
    date: () => {
      let date = faker.date.past();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  },
  currentMonth: {
    date: () => {
      let date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
});
