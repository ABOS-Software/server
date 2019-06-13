const {authenticate} = require('@feathersjs/authentication').hooks;
const Ajv = require('ajv');
const {validateSchema} = require('feathers-hooks-common');
const {categoriesCreate, categoriesEdit} = require('../../schemas');
const makeArray = require('../../hooks/makeArray');
const DeArray = require('../../hooks/DeArray');

const sequelizeParams = () => {
  return async context => {
    const seqClient = context.app.get('sequelizeClient');

    const year = seqClient.models['year'];
    if (context.params.query.year) {
      context.params.query.year_id = context.params.query.year;
      delete context.params.query.year;

    }
    context.params.sequelize = {
      attributes: ['id', ['category_name', 'categoryName'], ['delivery_date', 'deliveryDate']],
      include: [{model: year, attributes: ['id']}]
    };

    return context;
  };
};
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [sequelizeParams()] ,
    get: [sequelizeParams()],
    create: [validateSchema(categoriesCreate, Ajv), makeArray(),
      (context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
        for (const element in context.data) {
          context.data[element].category_name = context.data[element].categoryName;
          context.data[element].delivery_date = context.data[element].deliveryDate;
          context.data[element].year_id = context.data[element].year;
        }




        return context;
      }],
    update: [validateSchema(categoriesEdit, Ajv), makeArray(),(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      for (const element in context.data) {
        context.data[element].category_name = context.data[element].categoryName;
        context.data[element].delivery_date = context.data[element].deliveryDate;
        context.data[element].year_id = context.data[element].year.id;
      }



      return context;
    }, DeArray()],
    patch: [(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      for (const element in context.data) {
        context.data[element].category_name = context.data[element].categoryName;
        context.data[element].delivery_date = context.data[element].deliveryDate;
      }



      return context;
    }],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [DeArray()],
    update: [DeArray()],
    patch: [DeArray()],
    remove: [DeArray()]
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
