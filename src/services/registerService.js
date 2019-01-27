const createService = require('feathers-sequelize');

module.exports = {

  registerDbService: function (app, Model, name, hooks) {
    let url = '/' + name;
    const paginate = app.get('paginate');


    const serviceOptions = app.get('serviceOptions');
    let options = {
      paginate,
      ...serviceOptions
    };
    if (Model) {
      options = {
        Model,
        paginate,
        ...serviceOptions
      };
    }


    // Initialize our service with any options it requires
    app.use(url, createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('' + name);

    service.hooks(hooks);
  },
  registerService: function (app, initializer, name, hooks) {
    const paginate = app.get('paginate');
    let url = '/' + name;


    const serviceOptions = app.get('serviceOptions');
    let options = {
      paginate,
      ...serviceOptions
    };


    // Initialize our service with any options it requires
    app.use(url, initializer(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('' + name);

    service.hooks(hooks);
  }
};
