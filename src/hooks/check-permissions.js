// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {Forbidden} = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars

const checkRequirements = (context, roleParam) => {
  if (!context.params.provider) {
    return true;
  }
  if (!(roleParam && roleParam[0])) {
    return true;
  }
  if (!context.params.payload.userId) {
    throw new Forbidden('NOT AUTHENTICATED!');
  }
};

const getUserRole = async (role, userID, sequelize) => {
  const user_role = sequelize.models['user_role'];
  const uR = await user_role.findOne({
    where: {user_id: userID},
    include: [{model: role, attributes: ['authority']}]
  });
  if (!uR) {
    throw new Forbidden('You do not have the correct permissions.');

  }
  return uR.role.authority;
};
const checkEntry = (entry, roleName, roleRequired) => {
  let order = entry.entry.split('>');
  let found = false;
  for (const roleEntry of order) {
    if (!found) {
      found = roleEntry.trim() === roleName;

    } else if (roleEntry.trim() === roleRequired) {
      return true;

    }

  }
  return false;
};
const checkDeep = async (roleName, roleRequired, sequelize) => {
  const RoleHierarchyEntry = sequelize.models['role_hierarchy_entry'];
  const role_hierarchy = await RoleHierarchyEntry.findAll({where: {entry: {'$like': '%' + roleName + '%'}}});
  for (const entry of role_hierarchy) {
    if (checkEntry(entry, roleName, roleRequired)) {
      return true;
    }
  }
  return false;
};
const resolveContext = context => {
  return Promise.resolve(context);
};
const checkHook = async (context, roleParam) => {
  let escaped = checkRequirements(context, roleParam);
  if (escaped) {
    return resolveContext(context);
  }
  const roleRequired = roleParam[0];
  const sequelize = context.app.get('sequelizeClient');
  const role = sequelize.models['role'];
  const roleName = await getUserRole(role, context.params.payload.userId, sequelize);
  if (roleName === roleRequired) {
    return resolveContext(context);
  }
  if (await checkDeep(roleName, roleRequired, sequelize)) {
    return resolveContext(context);
  }
  throw new Forbidden('You do not have the correct permissions.');
};
module.exports = function (roleParam) {

  return async context => {
    return checkHook(context, roleParam);



  };
};
