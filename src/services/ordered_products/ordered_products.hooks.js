const {yearAttr, productsAttr} = require('../../models/attributes');
const {authenticate} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const {disallow} = require('feathers-hooks-common');
const {getYearWhere} = require('../utils');
const sequelizeParams = () => {
  return async context => {
    // Get the Sequelize instance. In the generated application via:
    const sequelize = context.app.get('sequelizeClient');
    const categories = sequelize.models['categories'];

    const products = sequelize.models['products'];
    const year = sequelize.models['year'];

    let yrInc = getYearWhere(context);
    // const year = sequelize.models['year'];
    // let yrInc = {model: year, attributes: yearAttr};
    // if (context.params.query.year) {
    //   yrInc.where = {id: context.params.query.year};
    //
    // }
    delete context.params.query.year;

    context.params.sequelize = {
      attributes: ['id', 'quantity', [sequelize.literal('`quantity` * `products`.`unit_cost`'), 'extendedCost'], ['user_name', 'userName']],
      include: [{
        model: products,
        attributes: productsAttr,
        include: [{model: categories}, {model: year, attributes: yearAttr}],
        as: 'products'
      }, yrInc],
    };
    return context;
  };
};

module.exports = {
  before: {
    all: [authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers()],
    find: [sequelizeParams()],
    get: [sequelizeParams()],
    create: [disallow('external')],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find(context) {
      let ops = [];


      context.result.data.forEach(op => {


        op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
        ops.push(op);


      });
      context.result.data = ops;
      return context;
    },
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
