const request = require('supertest');
const createCategories = (app) => {
  return app.service('Categories').create({'categoryName':'P','year':1,'deliveryDate':'2019-05-30'});

};

module.exports = {
  createCategories: createCategories
};
