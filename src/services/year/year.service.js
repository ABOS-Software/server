// Initializes the `year` service on path `/year`
const createService = require('feathers-sequelize');
const createModel = require('../../models/year.model');
const hooks = require('./year.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'Years', hooks);
};
