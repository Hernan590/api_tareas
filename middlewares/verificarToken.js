const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const tokenSinBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenSinBearer, JWT_SECRET);
    req.usuario = decoded; // guardamos el payload decodificado
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken };
