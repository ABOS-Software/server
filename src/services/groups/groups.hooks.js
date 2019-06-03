const {authenticate} = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {groupsCreate, groupsEdit} = require('../../schemas');
const checkPermissions = require('../../hooks/check-permissions');
const makeArray = require('../../hooks/makeArray');
const DeArray = require('../../hooks/DeArray');

const sequelizeParams = () => {
  return async context => {
    // Get the Sequelize instance. In the generated application via:
    //  const sequelize = context.app.get('sequelizeClient');
    const seqClient = context.app.get('sequelizeClient');

    const userYear = seqClient.models['user_year'];
    const year = seqClient.models['year'];

    context.params.sequelize = {
      attributes: [['group_name', 'groupName'], 'id', 'year_id'],
      include: [{model: year, attributes: ['id']}, {model: userYear, attributes: ['id']}]
    };

    return context;
  };
};
const addUpdateData = () => {
  return async context => {
    for (let dataKey in context.data) {
      context.data[dataKey].group_name = context.data[dataKey].groupName;

    }
    //context.data.year_id = context.data.year;
    return context;
  };
};
module.exports = {
  before: {
    all: [authenticate('jwt'), checkPermissions(['ROLE_USER'])],
    find: [sequelizeParams()],
    get: [sequelizeParams()],
    create: [validateSchema(groupsCreate, Ajv), makeArray(), addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    update: [validateSchema(groupsEdit, Ajv), makeArray(), addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    patch: [addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    remove: [checkPermissions(['ROLE_ADMIN'])]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [DeArray()],
    update: [DeArray()],
    patch: [DeArray()],
    remove: [DeArray()]
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
