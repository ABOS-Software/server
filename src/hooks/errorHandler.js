
const errors = require('@feathersjs/errors');
const getError = ctx => {
  const error = ctx.error;

  if (error.code === 404 || process.env.NODE_ENV === 'production') {
    error.stack = null;
  }
  if (error.code === 400) { error.message = 'Error. Check you entered everything correctly.'; } else { error.message = 'Error. Please retry in a few moments.'; }
  return error;
}


const errorHandler = ctx => {
  if (ctx.error) {
    const error = ctx.error;
    if (!error.code) {
      ctx.error = new errors.GeneralError('server error');
      return ctx;
    }
    ctx.error = getError(ctx);

    return ctx;
  }
};
module.exports = errorHandler;
