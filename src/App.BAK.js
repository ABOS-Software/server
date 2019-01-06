const R = require('ramda');

const path = require('path');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const Service = require('feathers-sequelize').Service;

const Sequelize = require('sequelize');
const service = require('feathers-sequelize');
const sequelize = new Sequelize('sequelize', 'admin', 'dev123', {
  dialect: 'mysql',
  host: '172.17.0.2',
  port: 3306,
  dialectOptions: {decimalNumbers: true}
});
const categories = sequelize.import(__dirname + '/models/categories');
const customers = sequelize.import(__dirname + '/models/customers');
const groups = sequelize.import(__dirname + '/models/groups');
const orderedProducts = sequelize.import(__dirname + '/models/ordered_products');
const orders = sequelize.import(__dirname + '/models/orders');
const products = sequelize.import(__dirname + '/models/products');
const role = sequelize.import(__dirname + '/models/role');
const RoleHierarchyEntry = sequelize.import(__dirname + '/models/role_hierarchy_entry');
const user = sequelize.import(__dirname + '/models/user');
const userManager = sequelize.import(__dirname + '/models/user_manager');
const userRole = sequelize.import(__dirname + '/models/user_role');
const userYear = sequelize.import(__dirname + '/models/user_year');
const year = sequelize.import(__dirname + '/models/year');

const categoriesAttr = [];

const customerAttr = {
  include: [['user_name', 'userName'], ['zip_code', 'zipCode'], ['customer_name', 'customerName'], ['street_address', 'streetAddress'], ['cust_email', 'custEmail']],
  exclude: ['cust_email', 'version', 'user_name', 'zip_code', 'customer_name', 'street_address']
};
const GroupAttr = [];
const orderedProductsAttr = ['id', 'quantity', ['user_name', 'userName']];
const ordersAttr = ['id', 'cost', 'quantity', ['amount_paid', 'amountPaid'], 'delivered', ['user_name', 'userName'],];
const productsAttr = ['id', ['human_product_id', 'humanProductId'], ['unit_cost', 'unitCost'], ['unit_size', 'unitSize'], ['product_name', 'productName']];
const roleAttr = [];
const roleHierarchyEntryAttr = [];
const userAttr = ['id', ['full_name', 'fullName'], 'username'];
const userManagerAttr = [];
const userRoleAttr = [];
const userYearAttr = [];
const yearAttr = ['id', 'year'];

const GroupInclude = [];
const categoriesInclude = {model: categories};


const roleInclude = [];
const roleHierarchyEntryInclude = [];
const userInclude = {model: user, attributes: userAttr};
const userManagerInclude = [];
const userRoleInclude = [];
const userYearInclude = [];

function yearInclude() {
  return {model: year, attributes: yearAttr};
}

//const  yearInclude = { model: year, attributes: yearAttr };
const productsInclude = {
  model: products,
  attributes: productsAttr,
  include: [categoriesInclude, yearInclude()],
  as: 'products'
};
const orderedProductsInclude = {
  model: orderedProducts,
  attributes: orderedProductsAttr,
  include: [productsInclude, yearInclude()],
  as: 'orderedProducts'
};
const ordersInclude = {
  model: orders,
  attributes: ordersAttr,
  include: [orderedProductsInclude, yearInclude()],
  as: 'order'
};
categories.associate(sequelize.models);
customers.associate(sequelize.models);
groups.associate(sequelize.models);
orderedProducts.associate(sequelize.models);
orders.associate(sequelize.models);
products.associate(sequelize.models);
//role.associate(sequelize.models);
//RoleHierarchyEntry.associate(sequelize.models);
//user.associate(sequelize.models);
userManager.associate(sequelize.models);
userRole.associate(sequelize.models);
userYear.associate(sequelize.models);
//year.associate(sequelize.models);

const Message = sequelize.define('message', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
});

// Create an Express compatible Feathers application instance.
const app = express(feathers());
sequelize.sync({});

// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));
// Enable REST services
app.configure(express.rest());
// Enable Socket.io services
app.configure(socketio());
// Create an in-memory Feathers service with a default page size of 2 items
// and a maximum size of 4
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS, PATCH, DELETE');
  next();
});
app.use('/messages', service({
  Model: Message,
  paginate: {
    default: 2,
    max: 4
  }
}));
app.use('/Categories', service({
  Model: categories,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.service('/Categories').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      if (context.params.query.year) {
        context.params.query.year_id = context.params.query.year;
        delete context.params.query.year;

      }
      context.params.sequelize = {
        attributes: ['id', ['category_name', 'categoryName'], ['delivery_date', 'deliveryDate']],
      };

      return context;
    }
  }
});
app.use('/customers', service({
  Model: customers,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  },



}));
app.service('/customers').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }

      context.params.sequelize = {
        include: [yrInc, userInclude, {
          model: orders,
          attributes: ordersAttr,
          include: [{
            model: orderedProducts,
            include: [productsInclude, yearInclude()],
            as: 'orderedProducts'
          }, yearInclude()],
          as: 'order'
        }],
        attributes: customerAttr,
      };


      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');


      context.params.sequelize = {
        include: [yearInclude(), userInclude, {
          model: orders,
          attributes: ordersAttr,
          include: [{
            model: orderedProducts,
            attributes: orderedProductsAttr,
            include: [productsInclude, yearInclude()],
            as: 'orderedProducts'
          }, yearInclude()],
          as: 'order'
        }],
        attributes: customerAttr,
      };

      return context;
    },
    async create(context) {
      //BadRequest: notNull Violation: customers.version cannot be null,
      // notNull Violation: customers.user_name cannot be null,
      // notNull Violation: customers.customer_name cannot be null,
      // notNull Violation: customers.street_address cannot be null,
      // notNull Violation: customers.latitude cannot be null,
      // notNull Violation: customers.longitude cannot be null
      let customer = context.data;
      let usr = await user.findByPk(customer.user);
      customer.user_id = customer.user;
      customer.year_id = customer.year;
      customer.user_name = usr.username;
      customer.customer_name = customer.customerName;
      customer.street_address = customer.streetAddress;
      customer.latitude = 0;
      customer.longitude = 0;
      let ops = [];
      customer.order.orderedProducts.forEach(op => {
        op.extended_cost = op.extendedCost;
        op.user_name = usr.username;
        op.user_id = customer.user;
        op.year_id = customer.year;
        op.products_id = op.products.id;
        ops.push(op);
      });
      customer.order.orderedProducts = ops;
      customer.order.user_name = usr.username;
      customer.order.user_id = customer.user;
      customer.order.year_id = customer.year;
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
    },
    async update(context) {
      let customer = context.data;
      let usr = await user.findByPk(customer.user.id);
      customer.user_name = usr.username;
      customer.customer_name = customer.customerName;
      customer.street_address = customer.streetAddress;
      customer.latitude = 0;
      customer.longitude = 0;
      let ops = [];
      customer.order.orderedProducts.forEach(op => {
        op.extended_cost = op.extendedCost;
        op.user_name = usr.username;
        op.user = usr;
        ops.push(op);
      });
      customer.order.orderedProducts = ops;
      customer.order.user_name = usr.username;
      customer.order.user = usr;
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
    }
  },
  after: {
    find(context) {
      let customers = [];


      context.result.data.forEach(cust => {

        let ops = [];
        cust.dataValues.order.dataValues.orderedProducts.forEach(op => {
          op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
          ops.push(op);
        });
        cust.dataValues.order.dataValues.orderedProducts = ops;
        customers.push(cust);
      });
      context.result.data = customers;
      return context;
    },
    get(context) {


      let ops = [];
      context.result.dataValues.order.dataValues.orderedProducts.forEach(op => {
        op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
        ops.push(op);
      });
      context.result.dataValues.order.dataValues.orderedProducts = ops;
      return context;

    },
    async update(context) {
      let order;
      if (context.data.order.id) {
        order = await orders.findByPk(context.data.order.id);
        order.set(context.data.order);
      } else {
        order = orders.build(context.data.order);
      }
      let customer = await customers.findByPk(context.data.id);
      let user = await customer.getUser();
      let year = await customer.getYear();
      let ops = [];
      order.user_name = context.data.user_name;

      for (const op of context.data.order.orderedProducts) {

        /*}
                await context.data.order.orderedProducts.forEach(async op => {*/
        let opM;
        if (op.id) {
          opM = await orderedProducts.findByPk(op.id);
          opM.set(op);
        } else {
          opM = orderedProducts.build(op);
        }
        let product = await products.findByPk(op.products.id);
        opM.user_name = context.data.user_name;

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
      await order.save();
      return context;
    },
    async create(context) {
      let order;
      if (context.result.order.id) {
        order = await orders.findByPk(context.result.order.id);
        order.set(context.result.order);
      } else {
        order = orders.build(context.result.order);
      }
      let customer = await customers.findByPk(context.result.id);
      let user = await customer.getUser();
      let year = await customer.getYear();
      let ops = [];
      order.user_name = context.result.user_name;

      for (const op of context.result.order.orderedProducts) {

        /*}
                await context.result.order.orderedProducts.forEach(async op => {*/
        let opM;
        if (op.id) {
          opM = await orderedProducts.findByPk(op.id);
          opM.set(op);
        } else {
          opM = orderedProducts.build(op);
        }
        let product = await products.findByPk(op.products_id);
        opM.user_name = context.result.user_name;

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
      await order.save();
      return context;
    }
  }
});
app.use('/Group', service({
  Model: groups,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.service('/Group').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');


      context.params.sequelize = {
        attributes: [['group_name', 'groupName'], 'id', 'year_id'],
        include: [{model: year, attributes: ['id']}, {model: userYear, attributes: ['id']}]
      };

      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');


      context.params.sequelize = {
        attributes: [['group_name', 'groupName'], 'id', ['year_id', 'year']]
      };

      return context;
    }
  }
});

app.use('/orderedProducts', service({
  Model: orderedProducts,
  raw: false,
  paginate: {
    default: 10,
    max: 500
  }

}));
app.service('/orderedProducts').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');

      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }
      context.params.sequelize = {
        attributes: ['id', 'quantity', [sequelize.literal('`quantity` * `products`.`unit_cost`'), 'extendedCost'], ['user_name', 'userName']],
        include: [productsInclude, yrInc],
      };
      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');

      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }
      context.params.sequelize = {
        attributes: ['id', 'quantity', [sequelize.literal('`quantity` * `products`.`unit_cost`'), 'extendedCost'], ['user_name', 'userName']],
        include: [productsInclude, yrInc],
      };
      return context;
    }
  },
  after: {
    find(context) {
      let ops = [];


      context.result.data.forEach(op => {


        op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
        ops.push(op);


      });
      context.result.data = ops;
      return context;
    },
  }
});
app.use('/orders', service({
  Model: orders,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.service('/orders').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }

      context.params.sequelize = {
        include: [{model: customers, attributes: ['donation']}, {
          model: orderedProducts,
          attributes: orderedProductsAttr,
          include: [{
            model: products,
            attributes: productsAttr,
            include: [categoriesInclude, yearInclude()],
            as: 'products'
          }, yearInclude()],
          as: 'orderedProducts'
        }, yrInc],
        attributes: ['id', 'cost', 'quantity', ['amount_paid', 'amountPaid'], 'delivered', ['user_name', 'userName'], 'customer_id'],
      };

      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }

      context.params.sequelize = {
        include: [{model: customers, attributes: ['donation']}, {
          model: orderedProducts,
          attributes: orderedProductsAttr,
          include: [{
            model: products,
            attributes: productsAttr,
            include: [categoriesInclude, yearInclude()],
            as: 'products'
          }, yearInclude()],
          as: 'orderedProducts'
        }, yrInc],
        attributes: ['id', 'cost', 'quantity', ['amount_paid', 'amountPaid'], 'delivered', ['user_name', 'userName'], 'customer_id'],
      };

      return context;
    }
  },
  after: {
    find(context) {
      let orders = [];
      context.result.data.forEach(res => {
        let ops = [];
        res.dataValues.orderedProducts.forEach(op => {
          op.dataValues.extendedCost = op.dataValues.quantity * op.products.dataValues.unitCost;
          ops.push(op);
        });
        res.dataValues.orderedProducts = ops;
        orders.push(res);
      });
      context.result.data = orders;
      return context;
    }
  }
});
app.use('/products', service({
  Model: products,
  raw: false,
  paginate: {
    default: 10,
    max: 1000
  }

}));
app.service('/products').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');

      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }
      context.params.sequelize = {
        attributes: productsAttr, include: [categoriesInclude, yrInc]
      };

      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');

      let yrInc = yearInclude();
      if (context.params.query.year) {
        yrInc.where = {id: context.params.query.year};
        delete context.params.query.year;

      }
      context.params.sequelize = {
        attributes: productsAttr, include: [categoriesInclude, yrInc]
      };

      return context;
    }
  }
});
app.use('/role', service({
  Model: role,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.use('/RoleHierarchyEntry', service({
  Model: RoleHierarchyEntry,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.use('/user', service({
  Model: user,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.service('/user').hooks({

  before: {
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');


      context.params.sequelize = {
        attributes: [['full_name', 'fullName'], 'username', 'id']
      };

      return context;
    },
    get(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');


      context.params.sequelize = {
        attributes: [['full_name', 'fullName'], 'username', 'id']
      };

      return context;
    }
  }
});
app.use('/userManager', service({
  Model: userManager,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.use('/userYear', service({
  Model: userYear,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.use('/userRole', service({
  Model: userRole,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
app.use('/Years', service({
  Model: year,
  raw: false,
  paginate: {
    default: 10,
    max: 100
  }

}));
const userHierarchyService = {
  async find(params) {
    console.log(params);
    let users = await user.findAll({attributes: ['id', 'full_name', 'username']});
    let yr = await year.findByPk(params.query.year);
    let usersList = {};


    for (const u of users) {
      let subUsers = {};
      let userYr = await userYear.findOne({where: {user_id: u.id, year_id: yr.id}});
      if (!userYr) {
        userYr = {};
        userYr.group_id = 1;
        userYr.status = 'DISABLED';
      }
      for (const su of users) {
        let userYearSub = await userYear.findOne({
          where: {user_id: u.id, year_id: yr.id},
          attributes: ['group_id', 'status']
        });
        if (!userYearSub) {
          userYearSub = {};
          userYearSub.group_id = 1;
          userYearSub.status = 'DISABLED';
        }
        subUsers[su.username] = {
          group: userYearSub.group_id,
          checked: (await userManager.findOne({
            where: {
              manage_id: u.id,
              user_id: su.id,
              year_id: yr.id
            }, attributes: ['id']
          }) != null),
          status: userYearSub.status
        };


      }
      let enabledYear = await userYear.findOne({
        where: {user_id: u.id, status: 'ENABLED'},
        attributes: ['year_id']
      });
      if (!enabledYear) {
        enabledYear = -1;
      } else {
        enabledYear = enabledYear.year_id;
      }
      usersList[u.username] = {
        id: u.id,
        fullName: u.full_name,
        group: userYr.group_id,
        subUsers: subUsers,
        status: userYr.status,
        enabledYear: enabledYear
      };


    }
    // console.log(usersList);
    return {data: [usersList]};
  },
  async get(id, params) {
  },
  async create(data, params) {

    //   log.debug(jsonParams.toString());
    let users = data.data;
    let yr = await year.findByPk(data.year);
    //let usersList = [:]
    for (const uK of Object.keys(users)) {
      const u = users[uK];
      let usr = await user.findOne({where: {username: uK}});
      let [userYr, cr] = await userYear.findOrBuild({where: {user_id: usr.id, year_id: yr.id}});
      if (u.group != null) {
        userYr.group_id = u.group;
      }
      if (u.enabledYear !== -1) {
        if (yr.id !== u.enabledYear) {
          if (u.status === 'ENABLED') {
            u.status = 'ARCHIVED';
          }
        } else {

          let enabledUsers = await userYear.findAll({where: {user_id: usr.id, status: 'ENABLED'}});
          for (let enabledU of enabledUsers) {
            enabledU.status = 'ARCHIVED';
            await enabledU.save();
            /*if (cr) {
                            // enabledU.errors.allErrors.each {
                            //     println it
                            // }
                        }*/
            //enabledU.save()
          }
          u.status = 'ENABLED';


        }
      } else {
        if (u.status === 'ENABLED') {
          u.status = 'ARCHIVED';
        }
      }
      userYr.status = u.status || 'DISABLED';
      await userYr.save();
      //let subUsers = [:]
      for (const suK of Object.keys(u.subUsers)) {
        const su = u.subUsers[suK];
        let subUser = await user.findOne({where: {username: suK}});
        // UserManager.findOrSaveByManageAndUser(user, subUser)

        if (su.checked) {
          await userManager.findOrCreate({where: {manage_id: usr.id, user_id: subUser.id, year_id: yr.id}});

        } else {
          let uM = await userManager.findOne({
            where: {
              manage_id: usr.id,
              user_id: subUser.id,
              year_id: yr.id
            }
          });
          if (uM != null) {
            uM.destroy();
            //uM.save()
          }
        }


      }


    }
    return ['success'];


  },
  async update(id, data, params) {
  },
  async patch(id, data, params) {
  },
  async remove(id, params) {
  }
};

app.use('/UserHierarchy', userHierarchyService);

const productUpdateService = {
  async get(id, params) {
  },
  async create(data, params) {

    let newProducts = data.newProducts;
    let updatedProducts = data.updatedProducts;
    let deletedProducts = data.deletedProducts;
    for (const product of newProducts) {

      if (product.status !== 'DELETE') {
        await products.create({
          human_product_id: product.humanProductId,
          product_name: product.productName,
          unit_size: product.unitSize,
          unit_cost: product.unitCost,
          category_id: product.category,
          year_id: data.year
        });
      }
    }
    for (const product of updatedProducts) {
      let prod = await products.findByPk(product.id);

      prod.human_product_id = product.humanProductId;
      prod.product_name = product.productName;
      prod.unit_size = product.unitSize;
      prod.unit_cost = product.unitCost;
      prod.category_id = product.category;
      await prod.save();

    }
    for (const product of deletedProducts) {

      let prod = await products.findByPk(product.id);
      await prod.destroy();

    }

    return ['success'];


  },
  async update(id, data, params) {
  },
  async patch(id, data, params) {
  },
  async remove(id, params) {
  }
};

app.use('/ProductsMany', productUpdateService);
//app.use(express.errorHandler());

Message.sync({force: true}).then(() => {
  // Create a dummy Message
  app.service('messages').create({
    text: 'Message created on server'
  }).then(message => console.log('Created message', message));
});

// Start the server
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
