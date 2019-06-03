/* eslint-disable no-console */


const assert = require('assert');
const should = require('should');

const rp = require('request-promise');
const url = require('url');
const app = require('../src/app');
const errorHandler = require('../src/hooks/errorHandler');
const request = require('supertest');

const port = app.get('port') || 3030;
const getUrl = pathname => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});
before(async function () {
  this.timeout(10000);
  return new Promise(function (resolve, reject) {
    const server = app.listen(port);

    server.on('listening', async function () {
      /* const models = app.get('sequelizeClient').models;
       for (const name of Object.keys(models)) {
         if ('associate' in models[name]) {
           models[name].associate(models);
         }
       }*/
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
          console.log(user);
          user.should.hasOwnProperty('role_id', 'NO Role_ID').above(0, 'NO ROLE ASSIGNED');
          console.log('3');

          user.should.hasOwnProperty('username', 'NO username').equal('test', 'Username not saved correctly');
          console.log('4');

          user.should.hasOwnProperty('full_name', 'NO full_name').equal('test Name', 'full name not saved correctly');
          console.log('5');

        });
        console.log('auth');
        await request(app)
          .post('/authentication')
          .send({
            'strategy': 'local',
            'username': 'test',
            'password': 'test'
          })
          .expect(201)
          .then((res, err) => {
            console.log(res.body.accessToken);
            app.set('TEST_JWT_TOKEN', res.body.accessToken);
            resolve();
          });
      });
    });
  });


});

describe('Feathers application tests', () => {

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
  describe ('Error Handling', function () {
    it('Errors without a code', function () {
      let fakeContext = {error: {
        stack: 'stack',
        code: null,
        message: 'invalid message'
      }};
      let returnContext = errorHandler(fakeContext);
      returnContext.should.containDeep({error: {code: 500, message: 'server error'}});
    });
    it('404 Error', function () {
      let fakeContext = {error: {
        stack: 'stack',
        code: 404,
        message: 'invalid message'
      }};
      let returnContext = errorHandler(fakeContext);
      returnContext.should.containDeep({error: {code: 404, message: 'Error. Please retry in a few moments.', stack: null}});
    });
    it('400 Error', function () {
      let fakeContext = {error: {
        stack: 'stack',
        code: 400,
        message: 'invalid message'
      }};
      let returnContext = errorHandler(fakeContext);
      returnContext.should.containDeep({error: {message: 'Error. Check you entered everything correctly.'}});
    });
    it('Other Error', function () {
      let fakeContext = {error: {
        stack: 'stack',
        code: 418,
        message: 'invalid message'
      }};
      let returnContext = errorHandler(fakeContext);
      returnContext.should.containDeep({error: {message: 'Error. Please retry in a few moments.'}});
    });
  });

});
