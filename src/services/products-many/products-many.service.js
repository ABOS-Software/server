// Initializes the `ProductsMany` service on path `/ProductsMany`
const createService = require('./products-many.class.js');
const hooks = require('./products-many.hooks');

const {registerService} = require('../registerService');
module.exports = function (app) {
  registerService(app, createService, 'ProductsMany', hooks);
};
