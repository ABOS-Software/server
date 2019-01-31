import {describe} from 'nyc/lib/commands/check-coverage';

const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const checkPermissions = require('../../src/hooks/check-permissions');

describe('\'checkPermissions\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return {id};
      }
    });

    app.service('dummy').hooks({
      before: checkPermissions()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');

    assert.deepEqual(result, {id: 'test'});
  });
});
