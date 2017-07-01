import Ember from "ember";

const { isPresent, computed } = Ember;

export default Ember.Component.extend({
  "data-test-date-picker": true,
  modalOpened: false,
  displayValue: computed("internalValue", {
    get() {
      let value = this.get("internalValue");
      if (isPresent(value)) {
        return value.toLocaleDateString("en-US");
      }
    }
  }),
  internalValue: computed.oneWay("value"),
  calendarCenter: computed.oneWay("value"),
  actions: {
    toggleModal() {
      this.toggleProperty("modalOpened");
    },
    dateSelected(date) {
      this.set("internalValue", date);
      if (this.get("onSelect")) {
        this.get("onSelect")(date);
      }
      this.send("toggleModal");
    }
  }
});
