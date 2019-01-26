const {authenticate} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
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
    context.data.group_name = context.data.GroupName;
    context.data.year_id = context.data.year;
    return context;
  };
};
module.exports = {
  before: {
    all: [authenticate('jwt'), checkPermissions(['ROLE_USER'])],
    find: [sequelizeParams()],
    get: [sequelizeParams()],
    create: [addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    update: [addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    patch: [addUpdateData(), checkPermissions(['ROLE_ADMIN'])],
    remove: [checkPermissions(['ROLE_ADMIN'])]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
