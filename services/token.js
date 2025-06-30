const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../conexion'); // o tu ORM
const { JWT_SECRET } = require('../config/config');

exports.verificarCredenciales = async (email, contrasena) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario) throw new Error('Usuario no encontrado');

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) throw new Error('Contraseña incorrecta');

    const payload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    return token;
};
