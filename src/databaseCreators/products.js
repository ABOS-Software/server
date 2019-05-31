const request = require('supertest');
const createProducts = (app) => {
  return app.service('products').create({
    'human_product_id':'2',
    'product_name':'3',
    'unit_size':'3',
    'unit_cost':'40.00',
    'category_id':1,
    'year_id': 1});
};

module.exports = {
  createProducts: createProducts
};
