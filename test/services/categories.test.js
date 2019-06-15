
const assert = require('assert');
const request = require('supertest');

const app = require('../../src/app');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createCategories} = require('../../src/databaseCreators/categories');
const {createUsers} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
describe('\'Categories\' service', () => {
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

  step('Creates Categories', function(done) {
    request(app)
      .post('/Categories')
      .send([
        {'categoryName': 'test1', 'year': 20, 'deliveryDate': '2019-06-13'},
        {'categoryName': 'test1-Update', 'year': 20, 'deliveryDate': '2019-06-13'},
        {'categoryName': 'test1-Delete', 'year': 20, 'deliveryDate': '2019-06-13'}
      ])
      .set('Authorization', app.get('USER2_JWT'))
      .expect(201)
      .then(response => {
        response.body.should.containDeep([
          {'category_name': 'test1', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'},
          {'category_name': 'test1-Update', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'},
          {'category_name': 'test1-Delete', 'year_id': 20, 'delivery_date': '2019-06-13T00:00:00.000Z'}
        ]);
        updateID = response.body[1].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Updates Categories', function(done) {
    request(app)
      .put('/Categories/' + updateID)
      .send({'id': updateID,'categoryName': 'test1-Updated', 'year': {'id': 20}, 'deliveryDate': '2019-06-14'})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({'category_name': 'test1-Updated', 'year_id': 20, 'delivery_date': '2019-06-14T00:00:00.000Z'});
        done();
      })
      .catch(err => done(err));
  });
  step('Deletes Categories', function(done) {
    request(app)
      .delete('/Categories')
      .query({'category_name': 'test1-Delete'})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds Categories', function(done) {
    request(app)
      .get('/Categories')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          {'categoryName': 'test1', 'year': {'id': 20}, 'deliveryDate': '2019-06-13T00:00:00.000Z'},
          {'categoryName': 'test1-Updated', 'year': {'id': 20}, 'deliveryDate': '2019-06-14T00:00:00.000Z'},
        ]);
        id = response.body.data[0].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Category', function(done) {
    request(app)
      .get('/Categories/' + id)
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          {'categoryName': 'test1', 'year': {'id': 20}, 'deliveryDate': '2019-06-13T00:00:00.000Z'},
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
