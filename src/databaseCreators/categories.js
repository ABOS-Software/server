const request = require('supertest');
const createCategories = (app) => {
  return app.service('Categories').create([
    {'id': 20, 'categoryName':'P','year':20,'deliveryDate':'2017-05-30'},
    {'id': 21, 'categoryName':'F','year':20,'deliveryDate':'2017-05-30'},
    {'id': 22, 'categoryName':'P','year':21,'deliveryDate':'2018-05-30'},
    {'id': 23, 'categoryName':'F','year':21,'deliveryDate':'2018-05-30'},
    {'id': 24, 'categoryName':'P','year':22,'deliveryDate':'2019-05-30'},
    {'id': 25, 'categoryName':'F','year':22,'deliveryDate':'2019-05-30'}
  ]);

};

module.exports = {
  createCategories: createCategories
};
