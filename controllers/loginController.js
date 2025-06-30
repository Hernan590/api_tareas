const loginModel = require('../models/loginModel');

const loginController = {};

loginController.loginUsuario = async function (req, res) {
  const { email, password } = req.body;

  try {
    const usuario = await loginModel.validarUsuario(email, password);
    const token = await loginModel.generarToken(usuario);
    res.status(200).json({ 
      token,
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = loginController;
