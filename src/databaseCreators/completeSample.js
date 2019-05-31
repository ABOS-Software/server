const {createYears} = require('./years');
const {createCustomers} = require('./customers');
const {createProducts} = require('./products');
const {createCategories} = require('./categories');
const completeSample = (app) => {
  step('Creating Years', (done) => {
    createYears(app).then((res, err) => {
      done();
    });
  });
  step('Creating Categories', (done) => {
    createCategories(app).then((res, err) => {
      done();
    });
  });
  step('Creating Products', (done) => {
    createProducts(app).then((res, err) => {
      done();
    });
  });
  step('Creating Customers', (done) => {
    createCustomers(app).then((res, err) => {
      done();
    });

  });
};
module.exports = completeSample;
