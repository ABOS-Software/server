const rewire = require('rewire');
const assert = require('assert');
const should = require('should');

const feathers = require('@feathersjs/feathers');
const filterManagedUsers = rewire('../../src/hooks/filter-managed-users');

describe('\'filterManagedUsers\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return {id};
      }
    });

    app.service('dummy').hooks({});
  });

  it('Get Year', () => {
    let fakeContext = {params: {
      user: {
        enabledYear: '2014'
      }
      }};

    let returnYear = filterManagedUsers.__get__('getYear')(fakeContext);

    returnYear.should.equal('2014');
  })
});
