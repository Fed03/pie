import Model from "ember-pouch/model";
import DS from "ember-data";

const { attr, belongsTo } = DS;

export default Model.extend({
  value: attr("number"),
  date: attr("date"),
  description: attr("string"),

  category: belongsTo("category")
});
