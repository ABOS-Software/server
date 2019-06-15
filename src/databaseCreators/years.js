const request = require('supertest');
const createYears = (app) => {
  return app.service('Years').create([{'id': 20, 'year':'1234'}, {'id': 21, 'year':'2345'},{'id': 22, 'year':'3456'}]);
};

module.exports = {
  createYears: createYears
};
