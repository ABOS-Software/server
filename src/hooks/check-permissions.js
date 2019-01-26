// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {Forbidden} = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (roleParam) {

  return async context => {
    if (!context.params.provider) {
      return Promise.resolve(context);
    }
    if (!(roleParam && roleParam[0])) {
      return context;
    }
    if (!context.params.payload.userId) {
      throw new Forbidden('NOT AUTHENTICATED!');
    }
    const roleRequired = roleParam[0];
    const sequelize = context.app.get('sequelizeClient');
    const user_role = sequelize.models['user_role'];
    const role = sequelize.models['role'];
    const RoleHierarchyEntry = sequelize.models['role_hierarchy_entry'];
    const uR = await user_role.findOne({
      where: {user_id: context.params.payload.userId},
      include: [{model: role, attributes: ['authority']}]
    });
    if (!uR) {
      throw new Forbidden('You do not have the correct permissions.');

    }
    const roleName = uR.role.authority;
    if (roleName === roleRequired) {
      return context;
    }
    const role_hierarchy = await RoleHierarchyEntry.findAll({where: {entry: {'$like': '%' + roleName + '%'}}});
    for (const entry of role_hierarchy) {
      let order = entry.entry.split('>');
      let found = false;
      for (const roleEntry of order) {
        if (!found) {
          found = roleEntry.trim() === roleName;

        } else if (roleEntry.trim() === roleRequired) {
          return context;

        }

      }
    }
    throw new Forbidden('You do not have the correct permissions.');



  };
};
