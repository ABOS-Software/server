
const assert = require('assert');
const app = require('../../src/app');

describe('\'year\' service', () => {
  it('registered the service', () => {
    const service = app.service('Years');

    assert.ok(service, 'Registered the service');
  });
});
