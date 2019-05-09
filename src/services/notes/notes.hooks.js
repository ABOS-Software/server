const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const sequelizeParams = () => {
  return async context => {
    const seqClient = context.app.get('sequelizeClient');

    const year = seqClient.models['year'];
    const note_codes = seqClient.models['note_codes'];
    if (context.params.query.year) {
      context.params.query.year_id = context.params.query.year;
      delete context.params.query.year;

    }
    context.params.sequelize = {
      attributes: ['id', 'note', 'created_at'],
      include: [{model: year, attributes: ['id', 'year']}, {model: note_codes, attributes: ['id', 'name']}]
    };

    return context;
  };
};
module.exports = {
  before: {
    all: [ authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers() ],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [],
    update: [],
    patch: [],
    remove: []
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
