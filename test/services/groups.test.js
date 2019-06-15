const request = require('supertest');

const assert = require('assert');
const app = require('../../src/app');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createUsers, createAdmin} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
describe('\'groups\' service', () => {
  let id = 1;
  let updateID = 2;
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
  step('Creating userMangagers', function(done)  {
    this.timeout(10000);

    createUsersManagement(app).then((res, err) => {
      done(err);
    });
  });

  step('Creates Groups', function(done) {
    request(app)
      .post('/Group')
      .send([
        {'groupName': 'test1', 'year_id': 20},
        {'groupName': 'test1-Update', 'year_id': 20},
        {'groupName': 'test1-Delete', 'year_id': 20}
      ])
      .set('Authorization', app.get('USER2_JWT'))
      .expect(201)
      .then(response => {
        response.body.should.containDeep([
          {'group_name': 'test1', 'year_id': 20},
          {'group_name': 'test1-Update', 'year_id': 20},
          {'group_name': 'test1-Delete', 'year_id': 20}
        ]);
        updateID = response.body[1].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Updates Groups', function(done) {
    request(app)
      .put('/Group/' + updateID)
      .send({'id': updateID,'groupName': 'test1-Updated', 'year_id': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({'id': updateID,'group_name': 'test1-Updated','year_id': 20});
        done();
      })
      .catch(err => done(err));
  });
  step('Deletes Groups', function(done) {
    request(app)
      .delete('/Group')
      .query({'Group_name': 'test1-Delete'})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds Groups', function(done) {
    request(app)
      .get('/Group')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          {'groupName': 'test1', 'year_id': 20},
          {'groupName': 'test1-Updated', 'year_id': 20},
        ]);
        id = response.body.data[0].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Group', function(done) {
    request(app)
      .get('/Group/' + id)
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          {'groupName': 'test1', 'year_id': 20},
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
