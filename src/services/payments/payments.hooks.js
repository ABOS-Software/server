const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const sequelizeParams = () => {
  return async context => {
    const seqClient = context.app.get('sequelizeClient');

    const year = seqClient.models['year'];
    const payment_methods = seqClient.models['payment_methods'];
    const user = seqClient.models['user'];

    if (context.params.query.year) {
      context.params.query.year_id = context.params.query.year;
      delete context.params.query.year;

    }
    context.params.sequelize = {
      attributes: ['id', 'amount', 'payment_date', 'note', 'user_id', 'user_name', 'customer_id', 'order_id', 'year_id'],
      include: [{
        model: user,
        attributes: ['id']
      }, {model: year, attributes: ['id', 'year']}, {model: payment_methods, attributes: ['id', 'name']}]
    };

    return context;
  };
};
module.exports = {
  before: {
    all: [ authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers({createField: 'user_id'}) ],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
