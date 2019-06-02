const request = require('supertest');
const createYears = (app) => {
  return app.service('Years').create([{'year':'1234'}, {'year':'2345'},{'year':'3456'}]);
};

module.exports = {
  createYears: createYears
};
