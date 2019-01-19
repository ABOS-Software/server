const {authenticate} = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find(context) {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
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
    },
    get: [(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
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
    }],
    create: [(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      context.data.category_name = context.data.categoryName;
      context.data.delivery_date = context.data.deliveryDate;
      context.data.year_id = context.data.year;
      return context;
    }],
    update: [(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');

      context.data.category_name = context.data.categoryName;
      context.data.delivery_date = context.data.deliveryDate;
      return context;
    }],
    patch: [(context) => {
      // Get the Sequelize instance. In the generated application via:
      //  const sequelize = context.app.get('sequelizeClient');
      context.data.category_name = context.data.categoryName;
      context.data.delivery_date = context.data.deliveryDate;

      return context;
    }],
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
