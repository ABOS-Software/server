// Application hooks that run for every service
const log = require('./hooks/log');

const errorHandler = require('./hooks/errorHandler');

module.exports = {
  before: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [log(), errorHandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
