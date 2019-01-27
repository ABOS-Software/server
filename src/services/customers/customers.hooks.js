const {ValidationError} = require('sequelize');
const {ordersInc, yearInc} = require('../../models/includes');

const {customerAttr, userAttr} = require('../../models/attributes');
const {authenticate} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('../../hooks/check-permissions');
const filterManagedUsers = require('../../hooks/filter-managed-users');
const makeOptions = (sequelize, yearVal) => {
  const user = sequelize.models['user'];
  let yrInc = yearInc(sequelize);
  if (yearVal) {
    yrInc.where = {id: yearVal};
  }
  return {
    include: [yrInc, {
      model: user,
      attributes: userAttr
    }, ordersInc(sequelize)],
    attributes: customerAttr,
  };
};
const sequelizeParams = () => {
  return async context => {
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
const getOrder = async (custData, sequelize) => {
  const orders = sequelize.models['orders'];

  let order;
  if (custData.order.id) {
    order = await orders.findByPk(custData.order.id);
    order.set(custData.order);
  } else {
    order = orders.build(custData.order);
  }
  return order;
};
const getOrderedProduct = async (op, sequelize) => {
  const orderedProducts = sequelize.models['ordered_products'];

  let opM;
  if (op.id) {
    opM = await orderedProducts.findByPk(op.id);
    opM.set(op);
  } else {
    opM = orderedProducts.build(op);
  }
  return opM;
};
const updateOrderedProducts = async (order, customer, custData, sequelize) => {
  const products = sequelize.models['products'];
  let user = await customer.getUser();
  let year = await customer.getYear();
  let ops = [];
  order.user_name = custData.user_name;

  for (const op of custData.order.orderedProducts) {

    let opM = await getOrderedProduct(op, sequelize);
    let product = await products.findByPk(op.products_id);
    opM.user_name = custData.user_name;

    opM.setUser(user, {save: false});
    opM.setYear(year, {save: false});
    opM.setCustomer(customer, {save: false});
    opM.setOrder(order, {save: false});
    opM.setProducts(product, {save: false});
    let response5 = await opM.save();
    ops.push(response5);
  }
  return ops;
};
const generateResult = async (ord, customer, seqClient, context) => {
  const customers = seqClient.models['customers'];

  if (typeof ord !== ValidationError) {
    const options = await makeOptions(seqClient);
    context.result = await customers.findByPk(customer.id, options);
    if (context.result.dataValues.order) {
      context.result.dataValues.order.dataValues.orderedProducts = calcProductCosts(context.result.dataValues.order);
    }
  }
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

    let order = await getOrder(custData, seqClient);
    let customer = await customers.findByPk(custData.id);
    let ops = await updateOrderedProducts(order, customer, custData, seqClient);
    await order.setOrderedProducts(ops, {save: false});
    //
    let ord = await order.save();
    return await generateResult(ord, customer, seqClient, context);
  };
};
const updateCustomerOrderedProducts = (customer, usr, update) => {
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
  return customer;
};
const updateCustomer = (customer, usr, update) => {
  customer.user_name = usr.username;
  customer.customer_name = customer.customerName;
  customer.street_address = customer.streetAddress;
  customer.latitude = 0;
  customer.longitude = 0;

  customer = updateCustomerOrderedProducts(customer, usr, update);

  customer.order.user_name = usr.username;
  if (update) {
    customer.order.user = usr;

  } else {
    customer.order.user_id = customer.user;
    customer.order.year_id = customer.year;
  }


  customer.order.amount_paid = customer.order.amountPaid;
  return customer;
};
const orderSequelizeOptions = (sequelize) => {
  const orderedProducts = sequelize.models['ordered_products'];
  const orders = sequelize.models['orders'];
  return {
    include: [{
      model: orders,
      as: 'order',
      include: [{
        model: orderedProducts,
        as: 'orderedProducts'
      }],

    }],
  };
};
const prepOrder = () => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient');
    let update = context.method === 'update';
    const user = sequelize.models['user'];
    let customer = context.data;
    let usr;
    if (update) {
      usr = await user.findByPk(customer.user.id);
    } else {
      usr = await user.findByPk(customer.user);
      customer.user_id = customer.user;
      customer.year_id = customer.year;
    }
    context.data = updateCustomer(customer, usr, update);
    context.params.sequelize = orderSequelizeOptions(sequelize);
    return context;
  };
};
const calcProductCosts = (orderArray) => {
  let ops = [];


  orderArray.dataValues.orderedProducts.forEach(op => {
    op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
    ops.push(op);
  });
  return ops;

};
const calcProductCostsMultiple = (customersD) => {
  let customers = [];

  customersD.forEach(cust => {
    if (cust.dataValues.order) {
      cust.dataValues.order.dataValues.orderedProducts = calcProductCosts(cust.dataValues.order);
    }
    customers.push(cust);

  });
  return customers;
};
const arrayContext = (context) => {
  if (!context.result.data) {
    return [context.result];
  } else {
    return context.result.data;
  }

};
const deArrayContext = (customers, context) => {
  if (!context.result.data) {
    context.result = customers[0];
  } else {
    context.result.data = customers;
  }
  return context;
};
const calcProductCostsHook = () => {
  return async context => {
    let customersD = arrayContext(context);
    let customers = calcProductCostsMultiple(customersD);
    return deArrayContext(customers, context);
  };
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
    find: [calcProductCostsHook()],
    get: [calcProductCostsHook()],
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
