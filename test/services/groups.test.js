import {describe} from 'nyc/lib/commands/check-coverage';

const assert = require('assert');
const app = require('../../src/app');

describe('\'groups\' service', () => {
  it('registered the service', () => {
    const service = app.service('Group');

    assert.ok(service, 'Registered the service');
  });
});
