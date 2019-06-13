const request = require('supertest');
const createUsers = (app) => {
  return app.service('user').create([
    {
      'id': 2,
      'username': 'test2',
      'password': 'test2',
      'full_name': 'test2 Name'
    },
    {
      'id': 3,
      'username': 'test2-sub1',
      'password': 'test2-sub1',
      'full_name': 'test2-sub1 Name'
    },
    {
      'id': 4,
      'username': 'test2-sub1-sub1',
      'password': 'test2-sub1-sub1',
      'full_name': 'test2-sub1-sub1 Name'
    }
  ]);

};

const createAdmin = (app) => {
  return app.service('user').create([
    {
      'id': 5,
      'username': 'admin-test2',
      'password': 'admin-test2',
      'full_name': 'admin-test2 Name'
    }
  ]).then(async (user) => {
    try {
      const role = app.service('role').Model;
      const authority = await role.findOne({where: {authority: 'ROLE_ADMIN'}});

      return app.service('userRole').patch(user.role_id, {role_id: authority.id});
    } catch (e) {
      console.log(e);
    }
  });

};

module.exports = {
  createUsers: createUsers,
  createAdmin: createAdmin
};
