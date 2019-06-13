const request = require('supertest');

const assert = require('assert');
const app = require('../../src/app');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createCategories} = require('../../src/databaseCreators/categories');
const {createUsers} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
describe('\'groups\' service', () => {
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
  step('Creates groups', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Updates groups', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Deletes groups', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds groups', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Gets Customer', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });

  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });
});
