const assert = require('assert');
const app = require('../../src/app');

describe('\'user_role\' service', () => {
  it('registered the service', () => {
    const service = app.service('userRole');

    assert.ok(service, 'Registered the service');
  });
});
