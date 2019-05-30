// Application hooks that run for every service
const log = require('./hooks/log');

const errors = require('@feathersjs/errors');
const errorHandler = ctx => {
  if (ctx.error) {
    const error = ctx.error;
    if (!error.code) {
      const newError = new errors.GeneralError('server error');
      ctx.error = newError;
      return ctx;
    }

    if (error.code === 404 || process.env.NODE_ENV === 'production') {
      error.stack = null;
    }
    if (error.code === 400) { error.message = 'Error. Check you entered everything correctly.'; } else { error.message = 'Error. Please retry in a few moments.'; }
    return ctx;
  }
};

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
