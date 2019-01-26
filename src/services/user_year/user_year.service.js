// Initializes the `user_year` service on path `/user-year`
const createService = require('feathers-sequelize');
const createModel = require('../../models/user_year.model');
const hooks = require('./user_year.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'userYear', hooks);
};
