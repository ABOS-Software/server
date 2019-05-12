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
      attributes: ['id', 'note', 'updated_at', 'user_id', 'user_name', 'customer_id', 'year_id'],
      include: [{model: year, attributes: ['id', 'year']}, {model: note_codes, attributes: ['id', 'name']}]
    };

    return context;
  };
};

const update = () => {
  return async context => {
    context.data.note_code_id = context.data.note_code.id;
    return context;
  };


};


module.exports = {
  before: {
    all: [ authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers({createField: 'user_id'}) ],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [],
    update: [update()],
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
