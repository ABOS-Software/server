const { authenticate } = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {paymentsCreate, paymentsEdit} = require('../../schemas');
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const makeArray = require('../../hooks/makeArray');
const DeArray = require('../../hooks/DeArray');
const {yearToId} = require('../utils');

const sequelizeParams = () => {
  return async context => {
    const seqClient = context.app.get('sequelizeClient');

    const year = seqClient.models['year'];
    const payment_methods = seqClient.models['payment_methods'];
    const user = seqClient.models['user'];

    context = yearToId(context);

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
const update = () => {
  return async context => {
    for (let dataKey in context.data) {
      context.data[dataKey].payment_method_id = context.data[dataKey].payment_method.id;
    }
    return context;
  };


};

const updateAmountPaid = () => {
  return async context => {

    for (let resultKey of context.result) {
      const seqClient = context.app.get('sequelizeClient');

      const orders = seqClient.models['orders'];
      const paymentsM = seqClient.models['payments'];
      let order = await orders.findOne({where: {customer_id: resultKey.customer_id}});
      let totalPaid = await paymentsM.sum('amount', {where: {customer_id: resultKey.customer_id}});
      if(order) {
        order.amount_paid = totalPaid;
        await order.save();
      }
    }

    return context;
  };
};
module.exports = {
  before: {
    all: [ authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers({createField: 'user_id'}) ],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [validateSchema(paymentsCreate, Ajv), makeArray(),],
    update: [validateSchema(paymentsEdit, Ajv), makeArray(), update(),DeArray()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [makeArray(), updateAmountPaid(), DeArray()],
    update: [makeArray(), updateAmountPaid(),DeArray()],
    patch: [makeArray(), updateAmountPaid(), DeArray()],
    remove: [makeArray(), updateAmountPaid(), DeArray()]
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
