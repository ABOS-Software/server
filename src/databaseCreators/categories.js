const request = require('supertest');
const createCategories = (app) => {
  return app.service('Categories').create([
    {'categoryName':'P','year':1,'deliveryDate':'2017-05-30'},
    {'categoryName':'F','year':1,'deliveryDate':'2017-05-30'},
    {'categoryName':'P','year':2,'deliveryDate':'2018-05-30'},
    {'categoryName':'F','year':2,'deliveryDate':'2018-05-30'},
    {'categoryName':'P','year':3,'deliveryDate':'2019-05-30'},
    {'categoryName':'F','year':3,'deliveryDate':'2019-05-30'}
  ]);

};

module.exports = {
  createCategories: createCategories
};
