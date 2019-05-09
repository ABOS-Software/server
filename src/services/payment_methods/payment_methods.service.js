// Initializes the `Categories` service on path `/categories`
const createModel = require('../../models/payment_methods.model');
const hooks = require('./payment_methods.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'payment_methods', hooks);
};
