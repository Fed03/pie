import Ember from 'ember';
import faker from 'faker';

export default Ember.Route.extend({
  seed() {
    for (var i = 0; i < 4; i++) {
      let cat = this.store.createRecord('category', {
        name: faker.commerce.department(),
        type: faker.random.arrayElement(['income', 'outcome'])
      });
      
      cat.save();
    }
  }
});
