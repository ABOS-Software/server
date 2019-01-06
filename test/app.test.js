const assert = require('assert');
var should = require('should');

const rp = require('request-promise');
const url = require('url');
const app = require('../src/app');
const request = require('supertest');

const port = app.get('port') || 3030;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});
before(async function () {
  const models = app.get('sequelizeClient').models;
  for (const name of Object.keys(models)) {
    if ('associate' in models[name]) {
      models[name].associate(models);
    }
  }
  /*  }
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });*/
  await app.get('sequelizeClient').sync({force: true}).then(async function () {
    await app.service('role').create([{
      authority: 'ROLE_ADMIN',
    }, {authority: 'ROLE_USER'}]);
    await app.service('user').create({
      'username': 'test',
      'password': 'test',
      'full_name': 'test Name'
    }).then(user => {
      assert.ok(user, 'User Creation Failed');
      user.should.hasOwnProperty('role_id', 'NO Role_ID').above(0, 'NO ROLE ASSIGNED');
      user.should.hasOwnProperty('username', 'NO username').equal('test', 'Username not saved correctly');
      user.should.hasOwnProperty('full_name', 'NO full_name').equal('test Name', 'full name not saved correctly');
      return 'user';
    });
    await request(app)
      .post('/authentication')
      .send({
        'strategy': 'local',
        'username': 'test',
        'password': 'test'
      })
      .expect(201)
      .end((err, res) => {
        console.log(res.body.accessToken);
        app.set('TEST_JWT_TOKEN', res.body.accessToken);
      });
  });

});

describe('Feathers application tests', () => {
  before(function (done) {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });
  before(function () {
    /*    return app.get('sequelizeClient').sync({force: true}).then(() => {
          return app.service('role').create([{
            authority: 'ROLE_ADMIN',
          }, {authority: 'ROLE_USER'}]);
        });*/
  });
  after(function (done) {
    this.server.close(done);
  });

  it('starts and shows the index page', () => {
    return rp(getUrl()).then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    );
  });

  describe('404', function () {
    it('shows a 404 HTML page', () => {
      return rp({
        url: getUrl('path/to/nowhere'),
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.ok(res.error.indexOf('<html>') !== -1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: getUrl('path/to/nowhere'),
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.equal(res.error.code, 404);
        assert.equal(res.error.message, 'Page not found');
        assert.equal(res.error.name, 'NotFound');
      });
    });
  });
  describe('Test Data', () => {
    it('test User', function () {
      return app.service('user').create({
        'username': 'test',
        'password': 'test',
        'full_name': 'test Name'
      }).then(user => {
        assert.ok(user, 'User Creation Failed');
        user.should.hasOwnProperty('role_id', 'NO Role_ID').above(0, 'NO ROLE ASSIGNED');
        user.should.hasOwnProperty('username', 'NO username').equal('test', 'Username not saved correctly');
        user.should.hasOwnProperty('full_name', 'NO full_name').equal('test Name', 'full name not saved correctly');
        return 'user';
      });
    });
  });
  describe('Authentication', function () {
    it('Successfully Authenticates and generates a JWT', function (done) {
      request(app)
        .post('/authentication')
        .send({
          'strategy': 'local',
          'username': 'test',
          'password': 'test'
        })
        .expect(201)
        .end((err, res) => {
          console.log(res.body.accessToken);
          app.set('TEST_JWT_TOKEN', res.body.accessToken);
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

  });
});
