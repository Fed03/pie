import {
  validatePresence,
  validateNumber,
  validateFormat
} from "ember-changeset-validations/validators";

export default {
  name: [validatePresence(true), validateFormat({ regex: /^(?![ .]+$)[a-zA-Z .]*$/ })],
  initialBalance: [
    validatePresence(true),
    validateNumber({
      positive: true
    })
  ]
};
