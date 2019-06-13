

const assert = require('assert');
const app = require('../../src/app');
const crypto = require('crypto');
const fs = require('fs');
const request = require('supertest');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createCategories} = require('../../src/databaseCreators/categories');
const {createUsers} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
describe('\'products\' service', () => {
  let JWT = '';
  it('registered the service', () => {
    const service = app.service('orders');

    assert.ok(service, 'Registered the service');
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
  it('Returns List of Products', function (done) {
    this.timeout(10000);
    request(app)
      .get('/products')
      .query({'$limit': 1000,
        '$skip': 0,
        '$sort[id]': -1,
        'year': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200).then((response) => {
      response.body.data.should.be.Array();
      response.body.data.should.have.lengthOf(2);
      done();
    })
      .catch((err) => {
        done(err);
      });
  });

  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });
});
