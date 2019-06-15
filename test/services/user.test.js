const assert = require('assert');
const app = require('../../src/app');
const request = require('supertest');
const {createUsers, createAdmin} = require('../../src/databaseCreators/users');
const {cleanup} = require('../../src/databaseCreators/cleanup');


describe('\'user\' service', () => {
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
  step('Finds Users', function(done) {
    this.timeout(100000);

    request(app)
      .get('/user/')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          {
            'fullName': 'test Name',
            'username': 'test',
            'id': 1
          },
          {
            'fullName': 'test2 Name',
            'username': 'test2',
            'id': 2
          },
          {
            'fullName': 'test2-sub1 Name',
            'username': 'test2-sub1',
            'id': 3
          },
          {
            'fullName': 'test2-sub1-sub1 Name',
            'username': 'test2-sub1-sub1',
            'id': 4
          },
          {
            'fullName': 'admin-test2 Name',
            'username': 'admin-test2',
            'id': 5
          }
        ]);
        done();
      })
      .catch(err => done(err));
  });
  step('Updates Customers', function(done) {
    this.timeout(100000);
    request(app)
      .put('/user/' + 2)
      .send({'username': 'test2', 'full_name': 'test2isupdated', 'password': 'test2u'})
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({
          'id': 2,
          'full_name': 'test2isupdated',
          'username': 'test2',
        });
        done();
      })
      .catch(err => done(err));
  });
  step('Deletes User', function(done) {
    request(app)
      .delete('/user/3')

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200, done);
  });
  step('Finds Users', function(done) {
    this.timeout(100000);

    request(app)
      .get('/user/')
      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.data.should.containDeep([
          {
            'fullName': 'test Name',
            'username': 'test',
            'id': 1
          },
          {
            'fullName': 'test2isupdated',
            'username': 'test2',
            'id': 2
          },
          {
            'fullName': 'test2-sub1-sub1 Name',
            'username': 'test2-sub1-sub1',
            'id': 4
          },
          {
            'fullName': 'admin-test2 Name',
            'username': 'admin-test2',
            'id': 5
          }
        ]);
        done();
      })
      .catch(err => done(err));
  });
  step('Gets Customer', function(done) {
    this.timeout(100000);

    request(app)
      .get('/user/4')

      .set('Authorization', app.get('USER2_JWT'))
      .expect(200)
      .then(response => {
        response.body.should.containDeep({
          'fullName': 'test2-sub1-sub1 Name',
          'username': 'test2-sub1-sub1',
          'id': 4,
          'enabledYear': -1
        });
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
