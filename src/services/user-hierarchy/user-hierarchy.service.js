// Initializes the `UserHierarchy` service on path `/UserHierarchy`
const createService = require('./user-hierarchy.class.js');
const hooks = require('./user-hierarchy.hooks');

const {registerService} = require('../registerService');
module.exports = function (app) {
  registerService(app, createService, 'UserHierarchy', hooks);
};
