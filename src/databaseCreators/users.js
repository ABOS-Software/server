const request = require('supertest');
const createUsers = (app) => {
  return app.service('user').create([
    {
      'username': 'test2',
      'password': 'test2',
      'full_name': 'test2 Name'
    },
    {
      'username': 'test2-sub1',
      'password': 'test2-sub1',
      'full_name': 'test2-sub1 Name'
    },
    {
      'username': 'test2-sub1-sub1',
      'password': 'test2-sub1-sub1',
      'full_name': 'test2-sub1-sub1 Name'
    }
  ]);

};

module.exports = {
  createUsers: createUsers
};
