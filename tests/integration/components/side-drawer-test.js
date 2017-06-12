import hbs from "htmlbars-inline-precompile";
import testSelector from "ember-test-selectors";
import { moduleForComponent, test } from "ember-qunit";
import { /*find,*/ findWithAssert } from "ember-native-dom-helpers";

moduleForComponent("side-drawer", "Integration | Component | side drawer", {
  integration: true
});

test("it renders as aside with `sidedrawer` class", function(assert) {
  this.render(hbs`
    {{#side-drawer}}
      template block text
    {{/side-drawer}}
  `);
  let el = findWithAssert(testSelector("sidedrawer"));
  assert.equal(el.textContent.trim(), "template block text");
  assert.equal(el.tagName.toLowerCase(), "aside");
  assert.ok(el.classList.contains("sidedrawer"));
});

test("it sets position and class depending on position property", function(
  assert
) {
  this.set("position", "left");
  this.render(hbs`
    {{#side-drawer position=position}}
      template block text
    {{/side-drawer}}
  `);

  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-left-positioned"
    ),
    "It has the `sidedrawer-left-positioned` class"
  );

  this.set("position", "right");
  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-right-positioned"
    ),
    "It has the `sidedrawer-right-positioned` class"
  );
});

test("it sets class depending on isOpen property", function(assert) {
  this.set("isOpen", true);
  this.render(hbs`
    {{#side-drawer isOpen=isOpen}}
      template block text
    {{/side-drawer}}
  `);

  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-opened"
    ),
    "It has the `sidedrawer-opened` class"
  );
  assert.notOk(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-closed"
    ),
    "It has not the `sidedrawer-closed` class"
  );

  this.set("isOpen", false);
  assert.ok(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-closed"
    ),
    "It has the `sidedrawer-closed` class"
  );
  assert.notOk(
    findWithAssert(testSelector("sidedrawer")).classList.contains(
      "sidedrawer-opened"
    ),
    "It has not the `sidedrawer-opened` class"
  );
});

//NOTE this tests are about css

// test("it sets the top css property based on parent position", function(assert) {
//   this.render(hbs`
//     {{#side-drawer}}
//       template block text
//     {{/side-drawer}}
//   `);
//
//   assert.equal(
//     parseInt(this.$("aside").css("top")),
//     parseInt(this.$().position().top)
//   );
// });

// test("it sets a class on sibling depending on position property", function(
//   assert
// ) {
//   this.set("position", "left");
//   this.render(hbs`
//     <div class="sidedrawer-sibling">foo</div>
//     {{#side-drawer position=position}}
//       template block text
//     {{/side-drawer}}
//   `);
//
//   assert.ok(
//     find(".sidedrawer-sibling").classList.contains("sidedrawer-sibling-left"),
//     "The sibling has the `sidedrawer-sibling-left` class"
//   );
//
//   this.set("position", "right");
//   assert.ok(
//     find(".sidedrawer-sibling").classList.contains("sidedrawer-sibling-right"),
//     "The sibling has the `sidedrawer-sibling-right` class"
//   );
// });
//
// test("it sets class on sibling depending on isOpen property", function(assert) {
//   this.set("isOpen", true);
//   this.render(hbs`
//     <div class="sidedrawer-sibling">foo</div>
//     {{#side-drawer isOpen=isOpen}}
//       template block text
//     {{/side-drawer}}
//   `);
//
//   assert.ok(
//     find(".sidedrawer-sibling").classList.contains("sidedrawer-sibling-opened"),
//     "The .sibling has the `sidedrawer-sibling-opened` class"
//   );
//
//   this.set("isOpen", false);
//   assert.notOk(
//     find(".sidedrawer-sibling").classList.contains("sidedrawer-sibling-opened"),
//     "The .sibling has not the `sidedrawer-sibling-opened` class"
//   );
// });
