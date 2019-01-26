const {ValidationError} = require('sequelize');
const {productsInc} = require('../../models/includes');

const {ordersAttr, customerAttr, orderedProductsAttr, yearAttr, userAttr, productsAttr} = require('../../models/attributes');
const {authenticate} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const makeOptions = (sequelize, yearVal) => {

  // Get the Sequelize instance. In the generated application via:
  const orderedProducts = sequelize.models['ordered_products'];
  const categories = sequelize.models['categories'];

  const orders = sequelize.models['orders'];
  const products = sequelize.models['products'];


  const user = sequelize.models['user'];

  const year = sequelize.models['year'];
  let yrInc = {model: year, attributes: yearAttr};
  if (yearVal) {
    yrInc.where = {id: yearVal};

  }


  return {
    include: [yrInc, {
      model: user,
      attributes: userAttr
    }, {
      model: orders,
      attributes: ordersAttr,
      include: [{
        model: orderedProducts,
        attributes: orderedProductsAttr,
        include: [productsInc(sequelize), {model: year, attributes: yearAttr}],
        as: 'orderedProducts'
      }, {model: year, attributes: yearAttr}],
      as: 'order'
    }],
    attributes: customerAttr,
  };


};
const sequelizeParams = () => {
  return async context => {
    // Get the Sequelize instance. In the generated application via:
    const sequelize = context.app.get('sequelizeClient');

    let yearVal = null;
    if (context.params.query && context.params.query.year) {
      yearVal = context.params.query.year;
      delete context.params.query.year;

    }

    context.params.sequelize = makeOptions(sequelize, yearVal);


    return context;
  };
};
const saveOrder = () => {
  return async context => {
    let custData;
    if (context.method === 'update') {
      custData = context.data;
    } else {
      custData = context.result;
    }


    const seqClient = context.app.get('sequelizeClient');
    const customers = seqClient.models['customers'];
    const orders = seqClient.models['orders'];
    const products = seqClient.models['products'];
    const orderedProducts = seqClient.models['ordered_products'];

    let order;
    if (custData.order.id) {
      order = await orders.findByPk(custData.order.id);
      order.set(custData.order);
    } else {
      order = orders.build(custData.order);
    }
    let customer = await customers.findByPk(custData.id);
    let user = await customer.getUser();
    let year = await customer.getYear();
    let ops = [];
    order.user_name = custData.user_name;

    for (const op of custData.order.orderedProducts) {

      /*}
      await custData.order.orderedProducts.forEach(async op => {*/
      let opM;
      if (op.id) {
        opM = await orderedProducts.findByPk(op.id);
        opM.set(op);
      } else {
        opM = orderedProducts.build(op);
      }
      let product = await products.findByPk(op.products_id);
      opM.user_name = custData.user_name;

      opM.setUser(user, {save: false});
      opM.setYear(year, {save: false});
      opM.setCustomer(customer, {save: false});
      opM.setOrder(order, {save: false});
      opM.setProducts(product, {save: false});
      // console.log(opM.toJSON());
      let response5 = await opM.save();
      ops.push(response5);
    }
    await order.setOrderedProducts(ops, {save: false});
    //
    let ord = await order.save();
    if (typeof ord !== ValidationError) {
      const options = await makeOptions(seqClient);
      context.result = await customers.findByPk(customer.id, options);
      if (context.result.dataValues.order) {
        context.result.dataValues.order.dataValues.orderedProducts = calcProductCosts(context.result.dataValues.order);
      }
    }
    return context;
  };
};
const prepOrder = () => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    let update = context.method === 'update';
    // const seqClient = context.app.get('sequelizeClient');
    //   const orders = seqClient.models['orders'];
    const orderedProducts = sequelize.models['ordered_products'];
    const orders = sequelize.models['orders'];

    const user = sequelize.models['user'];

    //BadRequest: notNull Violation: customers.version cannot be null,
    // notNull Violation: customers.user_name cannot be null,
    // notNull Violation: customers.customer_name cannot be null,
    // notNull Violation: customers.street_address cannot be null,
    // notNull Violation: customers.latitude cannot be null,
    // notNull Violation: customers.longitude cannot be null
    let customer = context.data;
    let usr;

    if (update) {
      usr = await user.findByPk(customer.user.id);
    } else {
      usr = await user.findByPk(customer.user);
      customer.user_id = customer.user;
      customer.year_id = customer.year;
    }
    customer.user_name = usr.username;
    customer.customer_name = customer.customerName;
    customer.street_address = customer.streetAddress;
    customer.latitude = 0;
    customer.longitude = 0;
    let ops = [];
    customer.order.orderedProducts.forEach(op => {
      op.extended_cost = op.extendedCost;
      op.user_name = usr.username;
      op.products_id = op.products.id;

      if (update) {
        op.user = usr;

      } else {
        op.user_id = customer.user;
        op.year_id = customer.year;
      }

      ops.push(op);
    });
    customer.order.orderedProducts = ops;
    customer.order.user_name = usr.username;
    if (update) {
      customer.order.user = usr;

    } else {
      customer.order.user_id = customer.user;
      customer.order.year_id = customer.year;
    }

    customer.order.amount_paid = customer.order.amountPaid;
    context.data = customer;
    context.params.sequelize = {
      include: [{
        model: orders,
        as: 'order',
        include: [{
          model: orderedProducts,
          as: 'orderedProducts'
        }],

      }],
    };
    return context;
  };
};
const calcProductCosts = (orderArray) => {
  let ops = [];

  if (orderArray) {

    orderArray.dataValues.orderedProducts.forEach(op => {
      op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
      ops.push(op);
    });
  }
  return ops;

};

// const seqClient = app.get('sequelizeClient');
// const orders = seqClient.models['orders'];
// const orderedProducts = seqClient.models['ordered_products'];

module.exports = {
  before: {
    all: [authenticate('jwt'), checkPermissions(['ROLE_USER']), filterManagedUsers()],
    find: [sequelizeParams()],
    get: [sequelizeParams()],
    create: [prepOrder()],
    update: [prepOrder()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find(context) {
      let customers = [];

      context.result.data.forEach(cust => {
        if (cust.dataValues.order) {
          cust.dataValues.order.dataValues.orderedProducts = calcProductCosts(cust.dataValues.order);
        }
        customers.push(cust);

      });
      context.result.data = customers;
      return context;
    },
    get(context) {

      if (context.result.dataValues.order) {
        context.result.dataValues.order.dataValues.orderedProducts = calcProductCosts(context.result.dataValues.order);
      }
      return context;

    },
    update: [saveOrder()],
    create: [saveOrder()],
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
