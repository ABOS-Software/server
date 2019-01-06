const assert = require('assert');
const request = require('supertest');

const app = require('../../src/app');

describe('\'Categories\' service', () => {

  it('registered the service', () => {
    const service = app.service('Categories');

    assert.ok(service, 'Registered the service');
  });
  it('returns list', (done) => {
    request(app)
      .get('/Categories')
      .set('Authorization', app.get('TEST_JWT_TOKEN'))
      .expect(200, done);
  });
});
