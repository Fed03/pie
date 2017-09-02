import { click } from "ember-native-dom-helpers";

export default async function selectCategory(category) {
  let selector = `${category.get("id")}-${category.get("name")}`;
  await click('[data-test-transaction-category]');
  return click(`[data-test-category-list-item="${selector}"]`);
}
