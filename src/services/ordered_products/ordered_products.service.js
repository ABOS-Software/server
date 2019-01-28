// Initializes the `ordered_products` service on path `/orderedProducts`
const createService = require('feathers-sequelize');
const createModel = require('../../models/ordered_products.model');
const hooks = require('./ordered_products.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'orderedProducts', hooks);
};

