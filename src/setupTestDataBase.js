/* eslint-disable no-console */
const mysql = require('mysql2/promise');
const config = require('config');

//...
async function setup() {
  const connectionDetails = config.get('mysql');


  /*  const sequelize = new Sequelize(connectionDetails.database, connectionDetails.username, connectionDetails.password, {
    dialect: 'mysql',
    host: connectionDetails.host,
    port: connectionDetails.port,
    logging: connectionDetails.logging,
    operatorsAliases,
    define: {
      freezeTableName: true
    },
    dialectOptions: connectionDetails.dialectOptions,
  });*/
  var connection = await mysql.createConnection({
    host: connectionDetails.host,
    user: connectionDetails.username,
    password: connectionDetails.password

  });

  connection.connect();
  await connection.execute('DROP DATABASE IF EXISTS ' + connectionDetails.database);
  await connection.execute('CREATE DATABASE IF NOT EXISTS ' + connectionDetails.database);

  connection.end();


}

setup().then(console.log('Done'));
