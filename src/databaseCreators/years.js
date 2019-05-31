const request = require('supertest');
const createYears = (app) => {
  return app.service('Years').create({'year':'1234'});
};

module.exports = {
  createYears: createYears
};
