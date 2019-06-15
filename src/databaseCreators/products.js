const request = require('supertest');
const createProducts = (app) => {
  return app.service('products').create([
    {
      'id': 20,
      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':20,
      'year_id': 20
    },
    {
      'id': 23,

      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':21,
      'year_id': 20
    },
    {
      'id': 21,

      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':22,
      'year_id': 21
    },
    {
      'id': 24,

      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':23,
      'year_id': 21
    },
    {
      'id': 22,

      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':24,
      'year_id': 22
    },
    {
      'id': 25,

      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':25,
      'year_id': 22
    },

  ]);
};

module.exports = {
  createProducts: createProducts
};
