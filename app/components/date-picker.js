import Ember from "ember";

export default Ember.Component.extend({
  "data-test-date-picker": true,
  modalOpened: false,
  actions: {
    toggleModal() {
      this.toggleProperty("modalOpened");
    }
  }
});
