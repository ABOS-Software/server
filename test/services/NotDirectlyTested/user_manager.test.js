
const assert = require('assert');
const app = require('../../../src/app');

describe('\'user_manager\' service', () => {
  it('registered the service', () => {
    const service = app.service('userManager');

    assert.ok(service, 'Registered the service');
  });
});
