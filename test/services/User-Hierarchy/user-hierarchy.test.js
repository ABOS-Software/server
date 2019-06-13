
const request = require('supertest');

const assert = require('assert');
const app = require('../../../src/app');
const {createYears} = require('../../../src/databaseCreators/years');
const {createGroups} = require('../../../src/databaseCreators/Groups');
const {createCustomers} = require('../../../src/databaseCreators/customers');
const {createProducts} = require('../../../src/databaseCreators/products');
const {createUsers, createAdmin} = require('../../../src/databaseCreators/users');
const {createUsersManagement} = require('../../../src/databaseCreators/user_managers');
const {cleanup} = require('../../../src/databaseCreators/cleanup');
const {createCategories} = require('../../../src/databaseCreators/categories');
const getResponseInitial = require('./getResponseInitial');
const getResponseAfter = require('./getResponseAfter');
const requestData = require('./requestData');
describe('\'UserHierarchy\' service', () => {
  let id = 1;
  let updateID = 2;
  let deleteID = 3;
  let orderID = 20;
  step('Creating Users', function(done)  {
    this.timeout(10000);

    createUsers(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Admin Users', function(done)  {
    this.timeout(10000);

    createAdmin(app).then((res, err) => {
      done(err);
    });
  });

  step('Get JWT', function(done) {
    request(app)
      .post('/authentication')
      .send({
        'strategy': 'local',
        'username': 'admin-test2',
        'password': 'admin-test2'
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
  step('Creating Groups', function(done)  {
    this.timeout(10000);

    createGroups(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating userMangagers', function(done)  {
    this.timeout(10000);

    createUsersManagement(app).then((res, err) => {
      done(err);
    });
  });
  step('Gets Hierarchy Initial', function(done) {
    request(app)
      .get('/UserHierarchy')
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.deepEqual(getResponseInitial);
        done();
      })
      .catch(err => done(err));
  });

  step('Creates Hierarchy', function(done) {
    this.timeout(100000);

    request(app)
      .post('/UserHierarchy')
      .send({year: 20, data: requestData})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(201, done);
  });

  step('Gets Hierarchy After', function(done) {
    request(app)
      .get('/UserHierarchy')
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.deepEqual(getResponseAfter);
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
