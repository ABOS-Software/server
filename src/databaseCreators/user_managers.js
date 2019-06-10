const request = require('supertest');
const createUsersManagement = (app) => {
  return app.service('userManager').create([
    {manage_id: 2, user_id: 3, year_id: 1},
    {manage_id: 3, user_id: 4, year_id: 1},
  ]);

};

module.exports = {
  createUsersManagement: createUsersManagement
};
