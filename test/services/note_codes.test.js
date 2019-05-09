const assert = require('assert');
const app = require('../../src/app');

describe('\'note_codes\' service', () => {
  it('registered the service', () => {
    const service = app.service('note-codes');

    assert.ok(service, 'Registered the service');
  });
});
