const { connection, connect } = require('../config/connection');

function keepActiveBd() {
  connection.query('SELECT 1', (err) => {
    if (err) {
      console.error('[PING] Error al mantener la base activa:', err.message);
    } else {
      console.log('[PING] Base de datos activa:', new Date().toISOString());
    }
  });
}

module.exports = keepActiveBd;