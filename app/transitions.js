export default function() {
  this.transition(this.hasClass("transaction-form-container"), this.toValue(true), this.use("toRight"), this.reverse("toLeft"));
}
