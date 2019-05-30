const {authenticate} = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {userHierarchy} = require('../../schemas');
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const {disallow} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [authenticate('jwt'), checkPermissions(['ROLE_ADMIN'])],
    find: [],
    get: [disallow()],
    create: [validateSchema(userHierarchy, Ajv), ],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
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
