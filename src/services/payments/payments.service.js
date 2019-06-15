// Initializes the `Categories` service on path `/categories`
const createModel = require('../../models/payments.model');
const hooks = require('./payments.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'payments', hooks);
};
