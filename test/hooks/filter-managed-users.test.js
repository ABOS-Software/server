const rewire = require('rewire');
const assert = require('assert');
const should = require('should');
const {createYears} = require('../../src/databaseCreators/years');
const {createUsers} = require('../../src/databaseCreators/users');
const {createUsersManagement} = require('../../src/databaseCreators/user_managers');
const app = require('../../src/app');

const feathers = require('@feathersjs/feathers');
const filterManagedUsers = rewire('../../src/hooks/filter-managed-users');
const {cleanup} = require('../../src/databaseCreators/cleanup');

describe('\'filterManagedUsers\' hook', () => {

  step('Creating Years', function(done)  {
    this.timeout(10000);

    createYears(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating Users', function(done)  {
    this.timeout(10000);

    createUsers(app).then((res, err) => {
      done(err);
    });
  });
  step('Creating userMangagers', function(done)  {
    this.timeout(10000);

    createUsersManagement(app).then((res, err) => {
      done(err);
    });
  });

  it('Get Year for Enabled', () => {
    let fakeContext = {params: {
      user: {
        enabledYear: '2014'
      }
      }};

    let returnYear = filterManagedUsers.__get__('getYear')(fakeContext);

    returnYear.should.equal('2014');
  });
  it('Get Year for Query ID', () => {
    let fakeContext = {
        params: { query: {
            year_id: '2014'
          }
        , user: {id: 0}
      }};

    let returnYear = filterManagedUsers.__get__('getYear')(fakeContext);

    returnYear.should.equal('2014');
  });
  it('Get Year for Query', () => {
    let fakeContext = {
      params: {
        query: {
            year: '2014'
          },
        user: {id: 0}
      }
    };


    let returnYear = filterManagedUsers.__get__('getYear')(fakeContext);

    returnYear.should.equal('2014');
  });
  it('test Validation', function (done) {
    this.timeout(10000);

    let fakeContext = {
      app: app,
      method: 'update',
      data: {
        user_id: 3,
      },

        params: {
        provider: 'rest',
          query: {
          },
          payload: {
            userId: 2,
        },
          user: {
            id: 2,
            enabledYear: 20
          },
        },
        path: 'dummy'
      };

    filterManagedUsers()(fakeContext).then((filter) => {
      filter.should.deepEqual(fakeContext);
      done();
    })
      .catch((err) => {
        done(err);
      });
  });
  after('Cleanup', function(done)  {
    this.timeout(10000);

    cleanup(app).then((res, err) => {
      done(err);
    });
  });
});
