const {authenticate} = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {userCreate, userEdit} = require('../../schemas');
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const sequelizeParams = () => {
  return async context => {
    // Get the Sequelize instance. In the generated application via:
    //  const sequelize = context.app.get('sequelizeClient');


    context.params.sequelize = {
      attributes: [['full_name', 'fullName'], 'username', 'id', 'password']
    };

    return context;
  };
};
module.exports = {
  before: {
    all: [authenticate('jwt')],

    create: [validateSchema(userCreate, Ajv), hashPassword(), checkPermissions(['ROLE_ADMIN'])],
    update: [validateSchema(userEdit, Ajv) , hashPassword(), checkPermissions(['ROLE_ADMIN'])],
    patch: [hashPassword(), checkPermissions(['ROLE_ADMIN'])],
    remove: [checkPermissions(['ROLE_ADMIN'])],
    find: [sequelizeParams(), authenticate('jwt'), filterManagedUsers({field: 'id'})],
    get: [sequelizeParams(), filterManagedUsers({field: 'id'})],

  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [async function (context) {
      const sequelize = context.app.get('sequelizeClient');
      const user_year = sequelize.models['user_year'];
      return user_year.findOne({where: {user_id: context.result.id, status: 'ENABLED'}}).then(uY => {
        if (uY) {
          const enYear = uY.year_id;
          if (!enYear) {
            context.result.enabledYear = -1;
          } else {
            context.result.enabledYear = enYear;

          }
        } else {
          context.result.enabledYear = -1;

        }
        return context;
      });

    }],
    create: [async function (context) {
      const sequelize = context.app.get('sequelizeClient');
      const user_role = sequelize.models['user_role'];
      const role = sequelize.models['role'];
      const authority = await role.findOne({where: {authority: 'ROLE_USER'}});
      let ret;
      if (authority) {
        ret = await user_role.create({user_id: context.result.id, role_id: authority.id});
      }
      else {
        ret = await user_role.create({user_id: context.result.id, role_id: 0});

      }
      /*      context.data.role_id = ret.id;
            context.result.role_id = role_id;*/
      context.result = {
        'username': context.result.username, 'password': context.result.password,
        'full_name': context.result.full_name, 'role_id': ret.id,
      };
      return context;
    }],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
