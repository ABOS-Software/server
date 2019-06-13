const {ValidationError} = require('sequelize');
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {customersCreate, customersEdit} = require('../../schemas');
const {ordersInc, yearInc} = require('../../models/includes');
const DeArray = require('../../hooks/DeArray');

const {customerAttr, userAttr} = require('../../models/attributes');
const {authenticate} = require('@feathersjs/authentication').hooks;
const opencage = require('opencage-api-client');
const checkPermissions = require('../../hooks/check-permissions');
const makeArray = require('../../hooks/makeArray');
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
const fuzzySearch = () => {
  return async context => {

    const sequelize = context.app.get('sequelizeClient');

    if (context.params.query && context.params.query.customer_name) {
      let where = context.params.sequelize.where || {};
      where.customer_name = {
        [sequelize.Op.like]: '%' + context.params.query.customer_name + '%'
      };
      context.params.sequelize.where = where;
      delete context.params.query.customer_name;

    }


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
  let extendedCost = 0.0;
  let quantity = 0;
  order.user_name = custData.user_name;

  for (const op of custData.order.orderedProducts) {

    let opM = await getOrderedProduct(op, sequelize);
    let product = await products.findByPk(op.products_id);
    opM.user_name = custData.user_name;
    extendedCost += opM.extended_cost;
    quantity += opM.quantity;
    opM.setUser(user, {save: false});
    opM.setYear(year, {save: false});
    opM.setCustomer(customer, {save: false});
    opM.setOrder(order, {save: false});
    opM.setProducts(product, {save: false});
    let response5 = await opM.save();
    ops.push(response5);
  }
  return {ops: ops, extendedCost: extendedCost, quantity: quantity};
};
const generateResult = async (ord, customer, seqClient, result) => {
  const customers = seqClient.models['customers'];

  if (typeof ord !== ValidationError) {
    const options = await makeOptions(seqClient);
    result = await customers.findByPk(customer.id, options);
    if (result.dataValues.order) {
      result.dataValues.order.dataValues.orderedProducts = calcProductCosts(result.dataValues.order);
    }
  }
  return result;
};
const checkError = async (customer, model, context) => {
  if (Array.isArray(model)) {
    let ret = [];
    for (const mod of model) {
      ret.push(await checkError(customer, mod));
    }
  }
  if (typeof model === ValidationError) {
    await safeDeleteCustomer(customer, context);
    throw model;
  }
  return model;
};
const safeDeleteCustomerContext = () => {
  return async context => {
    if (context.method === 'create') {
      let custData;
      if (context.method === 'update') {
        custData = context.data;
      } else {
        custData = context.result;
      }

      const seqClient = context.app.get('sequelizeClient');
      const customers = seqClient.models['customers'];
      if (custData && custData.id) {
        let customer = await customers.findByPk(custData.id);
        await safeDeleteCustomer(customer, context);
      }
    }
    return context;
  };
};
const safeDeleteCustomer = async (customer, context) => {
  if (context.method === 'create' && customer) {
    await customer.destroy();
  }
};
const saveOrder = () => {
  return async context => {


    let dataArray = [];
    if (context.method === 'update') {
      dataArray = context.data;
    } else {
      dataArray = context.data;
    }
    for (const custDataKey in dataArray) {

      const seqClient = context.app.get('sequelizeClient');
      const customers = seqClient.models['customers'];

      let customer = await customers.findByPk(context.result[custDataKey].id);
      try {
        let order = await getOrder(dataArray[custDataKey], seqClient);
        order.customer_id = customer.id;
        let ord = await order.save();

        let {ops, extendedCost, quantity} = await updateOrderedProducts(ord, customer, dataArray[custDataKey], seqClient);
        await checkError(customer, ops, context);
        await ord.setOrderedProducts(ops, {save: false});
        ord.quantity = quantity;
        ord.cost = extendedCost;
        //
        ord = await ord.save();
        await checkError(customer, ord, context);

        dataArray[custDataKey] = await generateResult(ord, customer, seqClient, dataArray[custDataKey]);
      }
      catch (e) {
        await safeDeleteCustomer(customer, context);
        return context;
      }
    }

  };
};

const updateCustomerOrderedProducts = (customer, usr, update) => {
  let ops = [];
  if (!customer.order.orderedProducts) {
    customer.order.orderedProducts = [];
    customer.order.quantity = 0;
    customer.order.cost = 0;
  }
  customer.order.quantity = customer.order.quantity || 0;
  customer.order.cost = customer.order.cost || 0;


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
const getCoords = async (address) => {
  let geocode = await opencage
    .geocode({q: address, countrycode: 'us', min_confidence: 6, no_annotations: 1, limit: 1});
  if (geocode && geocode.results.length > 0) {
    return geocode.results[0].geometry;
  }
  return false;

};
const updateCustomer = async (customer, usr, update) => {
  customer.user_name = usr.username;
  customer.customer_name = customer.customerName;
  customer.street_address = customer.streetAddress;
  customer.cust_email = customer.custEmail;
  customer.zip_code = customer.zipCode;
  let coords = await getCoords(customer.street_address + ' ' + customer.city + ', ' + customer.state + ' ' + customer.zipCode);
  if (coords) {
    customer.latitude = coords.lat;
    customer.longitude = coords.lng;
  } else {
    customer.latitude = 0;
    customer.longitude = 0;
    customer.use_coords = false;
  }

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

    for (let dataKey in context.data) {
      let update = context.method === 'update';
      const user = sequelize.models['user'];

      let customer = context.data[dataKey];
      let usr;
      if (update) {
        usr = await user.findByPk(customer.user.id);
      } else {
        usr = await user.findByPk(customer.user);
        customer.user_id = customer.user;
        customer.year_id = customer.year;
      }
      context.data[dataKey] = await updateCustomer(customer, usr, update);
    }
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
    find: [sequelizeParams(), fuzzySearch()],
    get: [sequelizeParams()],
    create: [validateSchema(customersCreate, Ajv),makeArray(), prepOrder()],
    update: [validateSchema(customersEdit, Ajv), makeArray(), prepOrder(),DeArray()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [calcProductCostsHook()],
    get: [calcProductCostsHook()],
    update: [makeArray(), saveOrder(),DeArray()],
    create: [makeArray(), saveOrder(),DeArray()],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [safeDeleteCustomerContext()],
    update: [],
    patch: [],
    remove: []
  }
};
