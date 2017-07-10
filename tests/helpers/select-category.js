import testSelector from "ember-test-selectors";
import { click } from "ember-native-dom-helpers";

export default async function selectCategory(category) {
  let selector = `${category.get("id")}-${category.get("name")}`;
  await click(testSelector("transaction-category"));
  return click(testSelector("category-list-item", selector));
}
