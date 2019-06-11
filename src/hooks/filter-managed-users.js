// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const {Forbidden, BadRequest} = require('@feathersjs/errors');
const getYear = (context) => {
  let year = 1;
  if (context.params.user.enabledYear) {
    year = context.params.user.enabledYear;
  } else if (context.params.query.year_id) {
    year = context.params.query.year_id;
  } else if (context.params.query.year) {
    year = context.params.query.year;
  }
  return year;
};
const getUMs = async (context, field) => {
  const sequelize = context.app.get('sequelizeClient');
  const user_manager = sequelize.models['user_manager'];
  let year = getYear(context);
  let uM = [];
  if (!context.params.query[field] || context.params.query.includeSub === 'true') {
    uM = await user_manager.findAll({
      where: {manage_id: context.params.payload.userId, year_id: year}

    });
  } else {
    uM = await user_manager.findAll({
      where: {manage_id: context.params.payload.userId, user_id: context.params.query[field], year_id: year}

    });
  }
  return uM;
};
const checkIncludes = (userId, userIds) => {
  if (!userIds.includes(userId)) {
    throw new BadRequest('Invalid User ID');
    //        console.log(context);
  }
};
const getUserIds = (userManagers) => {
  let userIds = [];
  for (const manageEntry of userManagers) {
    userIds.push(manageEntry.user_id);
  }
  return userIds;
};
const validate = async (context, userMangers, options) => {
  try {
    const {field, createField} = options;

    let userIds = getUserIds(userMangers);
    if (context.method === 'find' || context.method === 'get') {
      context.params.query[field] = {'$in': userIds};

    } else if (context.method === 'remove') {
      let uId = await context.service.get(context.id);
      checkIncludes(uId.user_id, userIds);

    } else if (context.method === 'update') {

      checkIncludes(context.data[field], userIds);
    } else {
      checkIncludes(context.data[createField], userIds);

    }
    return context;
  } catch (e) {
    throw e;
  }
};
module.exports = function (options = {}) {
  options = Object.assign({
    field: 'user_id',
    createField: 'user'
  }, options);
  const {field} = options;

  return async context => {
    if (!context.params.provider) {
      return Promise.resolve(context);
    }
    if (context.path === 'user' && !context.params.payload) {
      return context;
    }
    if (!context.params.payload.userId) {
      throw new Forbidden('NOT AUTHENTICATED!');
    }
    let uM = await getUMs(context, field);

    delete context.params.query[field];
    delete context.params.query.includeSub;

    if (uM) {
      try {
        context = await validate(context, uM, options);
      } catch (e) {
        throw e;
      }

    }
    return context;


  };
};
