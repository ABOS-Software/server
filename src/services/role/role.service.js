// Initializes the `role` service on path `/role`
const createService = require('feathers-sequelize');
const createModel = require('../../models/role.model');
const hooks = require('./role.hooks');

const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'role', hooks);
};
