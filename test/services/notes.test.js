const request = require('supertest');

const assert = require('assert');
const app = require('../../src/app');
const {createYears} = require('../../src/databaseCreators/years');
const {createCustomers} = require('../../src/databaseCreators/customers');
const {createProducts} = require('../../src/databaseCreators/products');
const {createUsers, createAdmin} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const {cleanup} = require('../../src/databaseCreators/cleanup');
const {createCategories} = require('../../src/databaseCreators/categories');

describe('\'notes\' service', () => {
  let id = 1;
  let updateID = 2;
  let deleteID = 3;
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
  step('Creates Notes', function(done) {
    request(app)
      .post('/notes')
      .send([
        {'note': 'note',
          'note_code_id': 1,
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2'},
        {'note': 'Note-Update',
          'note_code_id': 1,
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2'},
        {'note': 'Note-Delete',
          'note_code_id': 1,
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2'}
      ])
      .query({'year_id': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(201)
      .then(response => {
        response.body.should.containDeep([
          {'note': 'note',
            'note_code_id': 1,
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'},
          {'note': 'Note-Update',
            'note_code_id': 1,
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'},
          {'note': 'Note-Delete',
            'note_code_id': 1,
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'}
        ]);
        updateID = response.body[1].id;
        deleteID = response.body[2].id;

        done();
      })
      .catch(err => done(err));
  });
  step('Updates Notes', function(done) {
    request(app)
      .put('/notes/' + updateID)
      .send({'id': updateID,'note': 'Note-Updated',
        'note_code': {id: 1},
        'year_id': 20,
        'customer_id': 20,
        'user_id': 2,
        'user_name': 'test2'})
      .query({'year_id': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({'id': updateID,'note': 'Note-Updated',
          'note_code_id': 1,
          'year_id': 20,
          'customer_id': 20,
          'user_id': 2,
          'user_name': 'test2'});
        done();
      })
      .catch(err => done(err));
  });
  step('Deletes Notes', function(done) {
    request(app)
      .delete('/notes/' + deleteID)
      .query({'year_id': 20})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds Notes', function(done) {
    request(app)
      .get('/notes')
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          {'note': 'note',
            'note_code': { 'id': 1},
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'},
          {'note': 'Note-Updated',
            'note_code': { 'id': 1},
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'},
        ]);
        id = response.body.data[0].id;
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Note', function(done) {
    request(app)
      .get('/notes/' + id)
      .query({'year': 20})

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep(
          {'note': 'note',
            'note_code': { 'id': 1},
            'year_id': 20,
            'customer_id': 20,
            'user_id': 2,
            'user_name': 'test2'},
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
