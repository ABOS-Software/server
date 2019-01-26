// Initializes the `orders` service on path `/orders`
const createService = require('feathers-sequelize');
const createModel = require('../../models/orders.model');
const hooks = require('./orders.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'orders', hooks);
};
