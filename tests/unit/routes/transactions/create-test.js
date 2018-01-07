import { moduleFor, test } from "ember-qunit";
import sinon from "sinon";

moduleFor("route:transactions/create", "Unit | Route | transactions.create", {
  integration: true,
  beforeEach() {
    sinon.stub(this.container.lookup("service:store"));
    this.inject.service("store", { as: "storeStub" });
    sinon.stub(this.container.lookup("controller:transactions.create"));
    this.inject.controller("transactions.create", { as: "controllerStub" });
  }
});

test("it fetches the right data", function(assert) {
  this.subject().model();

  assert.ok(this.storeStub.findAll.calledWith("category"));
});

test("when route is exiting then it resets the controller", function(assert) {
  this.subject().resetController(this.controllerStub, true);

  assert.ok(this.controllerStub.resetToDefaultProperties.called);
});

test("when route is not exiting (model changing) then it does not reset the controller", function(assert) {
  this.subject().resetController(this.controllerStub, false);

  assert.ok(this.controllerStub.resetToDefaultProperties.notCalled);
});
