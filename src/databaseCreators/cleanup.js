const request = require('supertest');
const cleanupOrderedProducts = (app) => {
  return app.service('orderedProducts').remove(null);

};
const cleanupOrders = (app) => {
  return app.service('orders').remove(null);

};
const cleanupCustomers = (app) => {
  return app.service('customers').remove(null);

};
const cleanupProducts= (app) => {
  return app.service('products').remove(null);

};
const cleanupYears = (app) => {
  return app.service('Years').remove(null);

};

const cleanup = (app) => {
  return cleanupOrderedProducts(app)
    .then(cleanupOrders(app))
    .then(cleanupProducts(app))
    .then(cleanupCustomers(app))
    .then(cleanupYears(app));

};

module.exports = {
  cleanup: cleanup
};
