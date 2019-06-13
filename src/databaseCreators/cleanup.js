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
const cleanupCategories = (app) => {
  return app.service('Categories').remove(null);

};
const cleanupUsers = (app) => {
  return app.service('user').remove(null, {query: {id: {$in: [2,3,4, 5]}}});

};
const cleanupUMs = (app) => {
  return app.service('userManager').remove(null, {query: {user_id: {$in: [2,3,4, 5]}}});

};

const cleanup = (app) => {
  return cleanupYears(app)
    .then(cleanupUsers(app));

};

module.exports = {
  cleanup: cleanup
};
