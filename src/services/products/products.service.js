// Initializes the `products` service on path `/products`
const createService = require('feathers-sequelize');
const createModel = require('../../models/products.model');
const hooks = require('./products.hooks');

const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'products', hooks);
};
