// Initializes the `user_role` service on path `/user-role`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user_role.model');
const hooks = require('./user_role.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'userRole', hooks);
};
