/* eslint-disable no-console */

const Sequelize = require('sequelize');
const {Op} = Sequelize;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

module.exports = function (app) {
  const connectionDetails = app.get('mysql');
  let dbURL = process.env.DATABASE_URL || connectionDetails.URL;
  let sequelize;
  let logging;
  if (connectionDetails.logging) {
    logging = console.log;
  } else {
    logging = false;
  }
  console.log(dbURL);
  try {
    if (app.get('env') === 'test' && dbURL !== '') {
      console.log(dbURL);
      sequelize = new Sequelize(dbURL, {
        dialect: 'mysql',
        dialectOptions: connectionDetails.dialectOptions,

        logging: logging,
        operatorsAliases,
        define: {
          freezeTableName: true
        },
      });
    } else if (dbURL) {
      sequelize = new Sequelize(dbURL, {
        dialect: 'mysql',
        dialectOptions: connectionDetails.dialectOptions,

        logging: console.log,
        operatorsAliases,
        define: {
          freezeTableName: true
        },
      });

    } else {
      sequelize = new Sequelize(connectionDetails.database, connectionDetails.username, connectionDetails.password, {
        dialect: 'mysql',
        host: connectionDetails.host,
        port: connectionDetails.port,
        logging: logging,
        operatorsAliases,
        define: {
          freezeTableName: true
        },
        dialectOptions: connectionDetails.dialectOptions,
      });
    }
    const oldSetup = app.setup;

    app.set('sequelizeClient', sequelize);

    app.setup = function (...args) {
      const result = oldSetup.apply(this, args);

      // Set up data relationships
      const models = sequelize.models;
      Object.keys(models).forEach(name => {
        if ('associate' in models[name]) {
          models[name].associate(models);
        }
      });

      // Sync to the database
      if (app.get('env') !== 'test' && app.get('env') !== 'test_local') {
        sequelize.sync();
      }

      return result;
    };
  } catch (e) {
    console.error('problems connecting to database', e);
  }
};
