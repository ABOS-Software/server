// Initializes the `groups` service on path `/groups`
const createService = require('feathers-sequelize');
const createModel = require('../../models/groups.model');
const hooks = require('./groups.hooks');
const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'Group', hooks);
};
