const { authenticate } = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {notesCreate, notesEdit} = require('../../schemas');
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const makeArray = require('../../hooks/makeArray');
const DeArray = require('../../hooks/DeArray');

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
    for (let dataKey in context.data) {
      context.data[dataKey].note_code_id = context.data[dataKey].note_code.id;

    }
    return context;
  };


};


module.exports = {
  before: {
    all: [ authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers({createField: 'user_id'}) ],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [validateSchema(notesCreate, Ajv), makeArray() ],
    update: [validateSchema(notesEdit, Ajv), makeArray(), update(),DeArray()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [DeArray()],
    update: [DeArray()],
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
