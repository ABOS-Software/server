// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.
const logger = require('../logger');
const util = require('util');
const validErrors = require('../Errors');

// To see more detailed messages, uncomment the following line:
// logger.level = 'debug';
const logServiceCall = context => {
  logger.debug(`${context.type} app.service('${context.path}').${context.method}()`);

};
const logContext = context => {
  if (typeof context.toJSON === 'function' && logger.level === 'debug') {
    //logger.debug('Hook Context', util.inspect(context, {colors: false}));
  }
};
const logError = context => {
  if (context.error) {
    logger.error(context.error.stack);
  }
};
const log = context => {

  logServiceCall(context);
  logContext(context);
  logError(context);

};
module.exports = function () {
  return context => {
    log(context);
  };
};
