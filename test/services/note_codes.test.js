const assert = require('assert');
const app = require('../../src/app');

describe('\'note_codes\' service', () => {
  it('registered the service', () => {
    const service = app.service('note_codes');

    assert.ok(service, 'Registered the service');
  });
});
