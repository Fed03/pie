import { oneWay } from "@ember/object/computed";
import Component from "@ember/component";
import { isPresent } from "@ember/utils";
import { computed } from "@ember/object";

export default Component.extend({
  "data-test-date-picker": true,
  modalOpened: false,
  displayValue: computed("internalValue", {
    get() {
      let value = this.get("internalValue");
      if (isPresent(value)) {
        return value.toLocaleDateString("en-US");
      }
      return null;
    }
  }),
  internalValue: oneWay("value"),
  calendarCenter: oneWay("value"),
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
