import {describe} from 'nyc/lib/commands/check-coverage';

const assert = require('assert');
const app = require('../../src/app');

describe('\'user_year\' service', () => {
  it('registered the service', () => {
    const service = app.service('userYear');

    assert.ok(service, 'Registered the service');
  });
});
