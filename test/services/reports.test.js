const crypto = require('crypto');
const assert = require('assert');
const fs = require('fs');
const app = require('../../src/app');
const request = require('supertest');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createCategories} = require('../../src/databaseCreators/categories');
const {createUsers} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
const logo = 'data:image/png;base64,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';
describe('\'reports\' service', () => {
  let reportsConfig = {};
  before(async function(done) {
    done();
    reportsConfig = app.get('reports');
  });

  step('Creating Years', function(done)  {
    this.timeout(10000);

    createYears(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Users', function(done)  {
    this.timeout(10000);

    createUsers(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating userMangagers', function(done)  {
    this.timeout(10000);

    createUsersManagement(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Categories', function(done)  {
    this.timeout(10000);

    createCategories(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Products', function(done)  {
    this.timeout(10000);

    createProducts(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Customers', function(done)  {
    this.timeout(10000);

    createCustomers(app).then((res, err) => {
      done(err);
    });

  });
  step('Get JWT', function(done) {
    request(app)
      .post('/authentication')
      .send({
        'strategy': 'local',
        'username': 'test2',
        'password': 'test2'
      })
      .expect(201)
      .end((err, res) => {
        app.set('USER2_JWT', res.body.accessToken);
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
  it('generatesSplitReport', function (done) {
    this.timeout(10000);
    const stream = fs.createWriteStream('test/outputFiles/report-split' + new Date().toISOString() + '-test.pdf');
    request(app)
      .post('/Reports')
      .send(
        {
          'streetAddress': '123 S Broad St',
          'city': 'Philadelphia',
          'state': 'PA',
          'zipCode': '19109',
          'id': 'my-profile',
          'nickname': '',
          'Scout_name': 'example user',
          'Scout_Phone': '555-555-5555',
          'Scout_Rank': 'Eagle',
          'LogoLocation': {
            'base64': logo,
          },
          'template': 'customers_split',
          'Year': 20,
          'User': 2,
          'Category': [
            'P',
          ]
        })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .expect('content-type', 'application/pdf')
      .expect('content-disposition','attachment; filename=1234_customer_orders_P.pdf')
      .expect('content-length', reportsConfig.splitSize)
      .end((err, res) => {
        stream.end(res.body);
        stream.on('finish', () => {
          if (err) return done(err);
          done();
        });
      });

  });
  it('generateYearReport', function (done) {
    this.timeout(10000);
    const stream = fs.createWriteStream('test/outputFiles/report-year-' + new Date().toISOString() + '-test.pdf');
    request(app)
      .post('/Reports')
      .send(
        {
          'streetAddress': '123 S Broad St',
          'city': 'Philadelphia',
          'state': 'PA',
          'zipCode': '19109',
          'id': 'my-profile',
          'nickname': '',
          'Scout_name': 'example user',
          'Scout_Phone': '555-555-5555',
          'Scout_Rank': 'Eagle',
          'LogoLocation': {
            'base64': logo,
          },
          'template': 'Year Totals',
          'Year': 20,
          'User': 2,
          'Category': [
            'P',
          ]
        })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .expect('content-type', 'application/pdf')
      .expect('content-disposition','attachment; filename=1234_Total_Orders_P.pdf')
      .expect('content-length', reportsConfig.yearSize)
      .end((err, res) => {
        stream.end(res.body);
        stream.on('finish', () => {
          if (err) return done(err);
          done();
        });
      });
  });
  it('generateCustomerReport', function (done) {
    this.timeout(10000);
    const stream = fs.createWriteStream('test/outputFiles/report-Customer-' + new Date().toISOString() + '-test.pdf');
    request(app)
      .post('/Reports')
      .send(
        {
          'streetAddress': '123 S Broad St',
          'city': 'Philadelphia',
          'state': 'PA',
          'zipCode': '19109',
          'id': 'my-profile',
          'nickname': '',
          'Scout_name': 'example user',
          'Scout_Phone': '555-555-5555',
          'Scout_Rank': 'Eagle',
          'LogoLocation': {
            'base64': logo,
          },
          'template': 'Customer Year Totals',
          'Year': 20,
          'Customer': [20],
          'User': 2,
          'Category': [
            'P',
          ]
        })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .expect('content-type', 'application/pdf')
      .expect('content-disposition','attachment; filename=Individual_1234_Order_P.pdf')
      .expect('content-length', reportsConfig.customerSize)
      .end((err, res) => {
        stream.end(res.body);
        stream.on('finish', () => {
          if (err) return done(err);
          done();
        });
      });
  });
  it('generatesHistoricalReport', function (done) {
    this.timeout(10000);
    const stream = fs.createWriteStream('test/outputFiles/report-historical-' + new Date().toISOString() + '-test.pdf');
    request(app)
      .post('/Reports')
      .send(
        {
          'streetAddress': '123 S Broad St',
          'city': 'Philadelphia',
          'state': 'PA',
          'zipCode': '19109',
          'id': 'my-profile',
          'nickname': '',
          'Scout_name': 'example user',
          'Scout_Phone': '555-555-5555',
          'Scout_Rank': 'Eagle',
          'LogoLocation': {
            'base64': logo,
          },
          'template': 'Customer All-Time Totals',
          'Customer': [20],
          'User': 2,
        })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .expect('content-type', 'application/pdf')
      .expect('content-disposition','attachment; filename=Individual_historical_orders.pdf')
      .expect('content-length', reportsConfig.historicalSize)
      .end((err, res) => {
        stream.end(res.body);
        stream.on('finish', () => {
          if (err) return done(err);
          done();
        });
      });
  });
  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });

});
