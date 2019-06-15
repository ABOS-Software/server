const assert = require('assert');
const app = require('../../../src/app');

describe('\'payment_methods\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment_methods');

    assert.ok(service, 'Registered the service');
  });
});
