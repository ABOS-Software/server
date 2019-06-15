const request = require('supertest');
const createGroups = (app) => {
  return app.service('Group').create([
    {'id': 1, 'groupName':'Ungrouped','year_id':20},
    {'id': 2, 'groupName':'Group1','year_id':20},
    {'id': 3, 'groupName':'Ungrouped','year_id':21},
    {'id': 4, 'groupName':'Group1','year_id':21},
    {'id': 5, 'groupName':'Ungrouped','year_id':22},
    {'id': 6, 'groupName':'Group1','year_id':22}
  ]);

};

module.exports = {
  createGroups: createGroups
};
