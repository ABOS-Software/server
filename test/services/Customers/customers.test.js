const assert = require('assert');
const app = require('../../../src/app');
  const request = require('supertest');

const {createYears} = require('../../../src/databaseCreators/years');
const {createCustomers} = require('../../../src/databaseCreators/customers');
const {createProducts} = require('../../../src/databaseCreators/products');
const {createCategories} = require('../../../src/databaseCreators/categories');
const {createUsers} = require('../../../src/databaseCreators/users');
const {createUsersManagement} = require('../../../src/databaseCreators/user_managers');
const {cleanup} = require('../../../src/databaseCreators/cleanup');
const list_full = require('./list-full');
const list_after = require('./list-after');
const update_response = require('./update_response');
const update_request = require('./update_request');
const get = require('./get');
describe('\'customers\' service', () => {
  let id = 1;
  let updateID = 2;
  step('Creating Users', function(done)  {
    this.timeout(10000);

    createUsers(app).then((res, err) => {
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
  step('Creating Years', function(done)  {
    this.timeout(10000);

    createYears(app).then((res, err) => {
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
  step('Finds Customers', function(done) {
    request(app)
      .get('/customers/')
      .query({
        'year': 20
      })
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep(list_full
        );
        done();
      })
      .catch(err => done(err));
  });
  step('Updates Customers', function(done) {
    request(app)
      .put('/customers/' + 23)
      .query({year: 20})
      .send(update_request)
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(update_response);
        done();
      })
      .catch(err => done(err));
  });
  step('Deletes Customers', function(done) {
    request(app)
      .delete('/customers/20')
      .query({year: 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds Customers', function(done) {
    request(app)
      .get('/customers/')
      .query({year: 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          list_after
        );
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Customer', function(done) {
    request(app)
      .get('/customers/22')
      .query({year: 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          get
        );
        done();
      })
      .catch(err => done(err));
  });

  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });
});
