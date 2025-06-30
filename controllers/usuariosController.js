const usuariosModel = require('../models/usuariosModels')

const usuariosController = {}

usuariosController.usuarios = async function (req, res) {
    try {
        const datos_usuarios = await usuariosModel.getUsuarios()
        res.status(200).json({
            usuarios: datos_usuarios
        })

    } catch (error) {
        console.error('Error al obtener el listado de usuarios:', error)
        res.status(500).json({error: 'Error al obtener los datos'})
    }
}

usuariosController.crearUsuario = async function (req, res) {
    const data = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol
    }

    try {
        const results = await usuariosModel.crearUsuario(data)
        res.status(200).json({
            message: 'Usuario creado exitosamente',
            results: results
        })
    } catch (error) {
        console.error('Error al crear el usuario', error)
        res.status(500).json({
            message: 'Error al crear el usuario',
            error: error
        })
    }
}

usuariosController.consultarUsuario = async function (req, res) {
    const id = req.params.id;

    try {
        const results = await usuariosModel.consultarUsuario(id)
        res.status(200).json({
            message: 'Usuario consultado',
            detallesUsuario: results
        })
    } catch (error) {
        console.error('Error al consultar usuario:', error)
        res.status(500).json({
            message: 'Error al consultar usuario',
            error: error
        })
    }
}

usuariosController.editarUsuario = async function (req, res) {
    const data = {
        id: req.body.id,
        nombre: req.body.nombre,
        email: req.body.email,
        // password: req.body.password,
        rol: req.body.rol
    }

    try {
        const results = await usuariosModel.editarUsuario(data)
        res.status(200).json({
            message: 'Usuario editado correctamente',
            results: results
        })
    } catch (error) {
        console.error('Error al editar el usuario', error);
        res.status(500).json({
            message: 'Error al editar el usuario',
            error: error
        })
    }
}

usuariosController.eliminarUsuario = async function (req, res) {
    const data = {
        id: req.body.id,
        estado: req.body.estado
    };

    try {
        const results = await usuariosModel.desactivarUsuario(data)
        res.status(200).json({
            message: 'Estado cambiado correctamente',
            results: results
        });
    } catch (error) {
        console.error('Error al editar estado')
        res.status(500).json({
            message: 'Error al editar el estado',
            error: error
        })
    }
}

module.exports = usuariosController