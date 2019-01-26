// Initializes the `Categories` service on path `/categories`
const createModel = require('../../models/categories.model');
const hooks = require('./categories.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'Categories', hooks);
};
