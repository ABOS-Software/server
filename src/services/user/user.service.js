// Initializes the `user` service on path `/user`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user.model');
const hooks = require('./user.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'user', hooks);
};
