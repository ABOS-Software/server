const {createCustomers} = require('./customers');
const {createYears} = require('./years');
const {createProducts} = require('./products');
const {createCategories} = require('./categories');
module.exports = {
  createCustomers: createCustomers,
  createYears: createYears,
  createProducts: createProducts,
  createCategories: createCategories,
};
