const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connection, connect } = require('../config/connection');
const { JWT_SECRET } = require('../config/config');

const loginModel = {};

loginModel.validarUsuario = function(email, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT id_usuario, nombre, email, password, rol FROM usuarios WHERE email = ? AND estado = 1',
      [email],
      async (err, results) => {
        if (err) return reject(new Error('Error en la base de datos'));

        const usuario = results[0];
        if (!usuario) return reject(new Error('Usuario no encontrado'));
        if (!usuario.password) return reject(new Error('Contraseña del usuario no definida'));
        if (!password) return reject(new Error('Contraseña no enviada desde el frontend'));

        if (password !== usuario.password) {
          return reject(new Error('Contraseña incorrecta'));
        }

        resolve({
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        });
      }
    );
  });
}

loginModel.generarToken = function (usuario) {
  return new Promise((resolve, reject) => {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    try {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = loginModel;
