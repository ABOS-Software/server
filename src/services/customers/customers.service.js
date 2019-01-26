// Initializes the `customers` service on path `/customers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/customers.model');
const hooks = require('./customers.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'customers', hooks);
};
