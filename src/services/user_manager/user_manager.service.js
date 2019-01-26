// Initializes the `user_manager` service on path `/user-manager`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user_manager.model');
const hooks = require('./user_manager.hooks');

const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'userManager', hooks);
};
