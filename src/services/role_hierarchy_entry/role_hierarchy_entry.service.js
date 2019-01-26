// Initializes the `role_hierarchy_entry` service on path `/role-hierarchy-entry`
const createService = require('feathers-sequelize');
const createModel = require('../../models/role_hierarchy_entry.model');
const hooks = require('./role_hierarchy_entry.hooks');

const {registerDbService} = require('../registerService');
module.exports = function (app) {
  const Model = createModel(app);
  registerDbService(app, Model, 'RoleHierarchyEntry', hooks);
};
