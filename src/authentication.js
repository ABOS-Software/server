const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const getRole = async (hook) => {
  const seqClient = hook.app.get('sequelizeClient');

  const role = seqClient.models['role'];
  const userRole = seqClient.models['user_role'];
  const userRl = await userRole.findOne({
    where: {user_id: hook.params.payload.userId},
    include: {model: role}
  });
  if (userRl && userRl.role.authority) {
    Object.assign(hook.params.payload, {role: userRl.role.authority});
  } else {
    Object.assign(hook.params.payload, {role: 'ROLE_USER'});

  }
  return hook.params.payload;
};
const createAuthHook = () => {
  return async (hook) => {

    // make sure params.payload exists
    hook.params.payload = hook.params.payload || {};
    if (hook.params.payload.userId) {

      hook.params.payload = await getRole(hook);
    }
  };
};

module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        createAuthHook()
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
