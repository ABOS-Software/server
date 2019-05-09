// Initializes the `Categories` service on path `/categories`
const createModel = require('../../models/notes.model');
const hooks = require('./notes.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'notes', hooks);
};
