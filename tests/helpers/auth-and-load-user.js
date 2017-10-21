import { authenticateSession } from "pie/tests/helpers/ember-simple-auth";

async function authAndLoadUser(app, userData = {}) {
  let baseUserId = app.resolveRegistration("config:environment").baseUserId;
  const user = await create("user", Object.assign(userData, { id: baseUserId }));
  await authenticateSession(app, { baseUserId });

  return user;
}

export { authAndLoadUser };
