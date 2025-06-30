const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = require('./config.js');

const mysql = require('mysql2');

const connection = mysql.createConnection({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME
});

const connect = () => connection.connect((err) => {
  if (err) {
    console.error('Ocurrió un error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión correcta a la base de datos MySQL');
});

module.exports = { connect, connection };
