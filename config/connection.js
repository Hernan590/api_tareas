const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = require('./config.js');

const mysql = require('mysql2');

const connection = mysql.createPool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;
