/* eslint-disable no-console */
const mysql = require('mysql2/promise');
const config = require('config');
//...
async function setup() {
  let connection;
  let database;
  let dbURL = process.env.DATABASE_URL;
  if (dbURL) {
    let connectionString = process.env.DATABASE_URL;
    database = process.env.MYSQL_DATABASE;
    connection = await mysql.createConnection(connectionString);
  } else {

    const connectionDetails = config.get('mysql');
    database = connectionDetails.database;
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
    connection = await mysql.createConnection({
      host: connectionDetails.host,
      user: connectionDetails.username,
      password: connectionDetails.password

    });


  }
  connection.connect();
  await connection.execute('DROP DATABASE IF EXISTS ' + database);
  await connection.execute('CREATE DATABASE IF NOT EXISTS ' + database);

  connection.end();

}

setup().then(console.log('Done'));
