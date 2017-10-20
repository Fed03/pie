import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";
import { make } from "ember-data-factory-guy";
import { run } from "@ember/runloop";
import wait from "ember-test-helpers/wait";

async function authAndLoadUser(app, userData = {}) {
  let baseUserId = app.resolveRegistration("config:environment").baseUserId;
  await run(() => {
    return make("user", Object.assign(userData, { id: baseUserId })).save();
  });

  await authenticateSession(app, { baseUserId });

  return wait();
}

export { authAndLoadUser };
