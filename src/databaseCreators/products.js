const request = require('supertest');
const createProducts = (app) => {
  return app.service('products').create([
    {
      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':1,
      'year_id': 1
    },
    {
      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':2,
      'year_id': 1
    },
    {
      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':3,
      'year_id': 2
    },
    {
      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':4,
      'year_id': 2
    },
    {
      'human_product_id':'1',
      'product_name':'1',
      'unit_size':'3',
      'unit_cost':'40.00',
      'category_id':5,
      'year_id': 3
    },
    {
      'human_product_id':'2',
      'product_name':'2',
      'unit_size':'4',
      'unit_cost':'10.00',
      'category_id':6,
      'year_id': 3
    },

  ]);
};

module.exports = {
  createProducts: createProducts
};
