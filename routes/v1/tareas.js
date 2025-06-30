const express = require('express');
const router = express.Router();
const tareasController = require('../../controllers/tareasController')
const { verificarToken } = require('../../middlewares/verificarToken'); 

router.get('/getProyectos', verificarToken, tareasController.proyectos)
router.get('/getAsignados/:id_proyecto', verificarToken, tareasController.asignados)
router.get('/getProyecto/:id_proyecto', verificarToken, tareasController.getProyecto)
router.get('/getTareas/:id_proyecto', verificarToken, tareasController.tareas)
router.get('/getUsersActivos', verificarToken, tareasController.usersActivos)
router.post('/cambiarEstadoTarea', verificarToken, tareasController.cambiarEstadoTarea);
router.post('/editarProyecto', verificarToken, tareasController.editarProyecto)
router.post('/crearProyecto', verificarToken, tareasController.crearProyecto)
router.post('/eliminarProyecto', verificarToken, tareasController.eliminarProyecto)
router.post('/agregarUsuarioProyecto', verificarToken, tareasController.agregarUsuarioProyectos)
router.post('/agregarTareas', verificarToken, tareasController.agregarTareas)

module.exports = router