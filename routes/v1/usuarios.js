const express = require('express');
const router = express.Router();
const usuariosController = require('../../controllers/usuariosController')
const { verificarToken } = require('../../middlewares/verificarToken'); 

router.get('/getUsuarios', verificarToken, usuariosController.usuarios)
router.post('/crearUsuario', verificarToken, usuariosController.crearUsuario)
router.get('/consultarUsuario/:id', verificarToken, usuariosController.consultarUsuario)
router.post('/editarUsuario', verificarToken, usuariosController.editarUsuario)
router.post('/desactivarUsuario', verificarToken, usuariosController.eliminarUsuario)
module.exports = router