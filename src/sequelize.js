const Sequelize = require('sequelize');
const logger = require('./logger');

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
const getURLSequelizeInstance = (connectionDetails, url, logging) => {
  return new Sequelize(url, {
    dialect: 'mysql',
    dialectOptions: connectionDetails.dialectOptions,

    logging: logging,
    operatorsAliases,
    define: {
      freezeTableName: true
    },
  });
};
const getConfigSequelizeInstance = (connectionDetails, logging) => {
  return new Sequelize(connectionDetails.database, connectionDetails.username, connectionDetails.password, {
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
};
const getLogger = (connectionDetails) => {
  if (connectionDetails.logging && (!process.env.logging || process.env.logging !== 'false')) {
    // eslint-disable-next-line no-console
    return console.log;
  } else {
    return false;
  }
};
const getSequelizeInstance = (app) => {
  const connectionDetails = app.get('mysql');
  logger.debug(JSON.stringify(connectionDetails));
  let dbURL = process.env.DATABASE_URL || connectionDetails.URL;
  let sequelize;

  let logging = getLogger(connectionDetails, logger);
  logger.debug(dbURL);
  try {
    if (dbURL) {
      sequelize = getURLSequelizeInstance(connectionDetails, dbURL, logging);
    } else {
      sequelize = getConfigSequelizeInstance(connectionDetails, logging);
    }
  } catch (e) {
    logger.error('problems connecting to database', e);
    throw e;
  }
  if (!sequelize) {
    throw new Error('Error connecting to database');
  }
  return sequelize;
};
module.exports = function (app) {

  const oldSetup = app.setup;
  let sequelize = getSequelizeInstance(app);
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

};
