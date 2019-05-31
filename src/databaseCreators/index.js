const {createCustomers} = require('./customers');
const {createYears} = require('./years');
const {createProducts} = require('./products');
const {createCategories} = require('./categories');
const completeSample = require('./completeSample');
module.exports = {
  createCustomers: createCustomers,
  createYears: createYears,
  createProducts: createProducts,
  createCategories: createCategories,
  completeSample: completeSample
};
