// Initializes the `Categories` service on path `/categories`
const createModel = require('../../models/note_codes.model');
const hooks = require('./note_codes.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'note_codes', hooks);
};
