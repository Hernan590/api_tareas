const tareasModel = require('../models/tareasModel')

const tareasController = {}

tareasController.proyectos = async function (req, res) {
    try {
        const datos_proyectos = await tareasModel.getProyectos()
        res.status(200).json({
            proyectos: datos_proyectos
        })

    } catch (error) {
        console.error('Error al obtener el listado de proyectos:', error)
        res.status(500).json({error: 'Error al obtener los datos'})
    }
}

tareasController.asignados = async function (req, res) {
    const id = req.params.id_proyecto;

    try {
        const results = await tareasModel.consultarAsignados(id)
        res.status(200).json({
            message: 'Asignados Consultados',
            asignados: results
        })
    } catch (error) {
        console.error('Error al consultar Asignados:', error)
        res.status(500).json({
            message: 'Error al consultar Asignados',
            error: error
        })
    }
}

tareasController.tareas = async function (req, res) {
    const id_proyecto = req.params.id_proyecto;

    try {
        const results = await tareasModel.consultarTareas(id_proyecto)
        const asignados = await tareasModel.usuariosProyecto(id_proyecto);

        res.status(200).json({
            message: 'Tareas Consultadas',
            detallesTareas: results,
            usuarios: asignados
        })
    } catch (error) {
        console.error('Error al consultar Tareas:', error)
        res.status(500).json({
            message: 'Error al consultar Tareas',
            error: error
        })
    }
}

tareasController.usersActivos = async function (req, res) {
    try {
        const datos_usuarios = await tareasModel.getUsersActivos()
        res.status(200).json({
            usuarios: datos_usuarios
        })

    } catch (error) {
        console.error('Error al obtener el listado de usuarios:', error)
        res.status(500).json({error: 'Error al obtener los datos'})
    }
}

tareasController.crearProyecto = async function (req, res) {
    const data = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        creado_por: req.body.creado_por
    }
    
    try {
        const results = await tareasModel.crearProyecto(data)
        const lastInsertId = results.insertId; 
        res.status(200).json({
            message: 'Proyecto creado exitosamente',
            id_proyecto: lastInsertId,
        })
    } catch (error) {
        console.error('Error al crear el proyecto', error)
        res.status(500).json({
            message: 'Error al crear el proyecto',
            error: error
        })
    }
}

tareasController.eliminarProyecto = async function (req, res) {
    const data = {
        id: req.body.id,
        estado: req.body.estado
    };

    try {
        const results = await tareasModel.eliminarProyecto(data)
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

tareasController.agregarUsuarioProyectos = async function (req, res) {
    const { id_proyecto, usuarios } = req.body;

    if (!id_proyecto || !Array.isArray(usuarios)) {
        return res.status(400).json({ message: 'Datos inválidos' });
    }

    try {
        for (const id_usuario of usuarios) {
            await tareasModel.asignarUsuarioProyecto(id_proyecto, id_usuario);
        }

        res.status(200).json({ message: 'Usuarios asignados exitosamente al proyecto' });
    } catch (error) {
        console.error('Error al asignar usuarios al proyecto:', error);
        res.status(500).json({ message: 'Error al asignar usuarios al proyecto', error });
    }
}

tareasController.agregarTareas = async function (req, res) {
    const data = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        id_proyecto: req.body.id_proyecto,
        asignado_a: req.body.id_usuario
    }

    try {
        const results = await tareasModel.agregarTareas(data)
        res.status(200).json({
            message: 'Tareas agregadas al proyecto',
            results: results
        });
    } catch (error) {
        console.error('Error al agregar las tareas al proyecto')
        res.status(500).json({
            message: 'Error al agregar las tareas al proyecto',
            error: error
        })
    }
}

tareasController.getProyecto = async function (req, res) {
    const id_proyecto = req.params.id_proyecto;

    try {
        const results = await tareasModel.consultarProyecto(id_proyecto)
        res.status(200).json({
            message: 'Proyecto consultado',
            detallesProyecto: results
        })
    } catch (error) {
        console.error('Error al consultar proyecto:', error)
        res.status(500).json({
            message: 'Error al consultar proyecto',
            error: error
        })
    }
}

tareasController.editarProyecto = async function (req, res) {
    const data = {
        id_proyecto: req.body.id_proyecto,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }

    try {
        const results = await tareasModel.editarProyecto(data)
        res.status(200).json({
            message: 'Proyecto editado correctamente',
            results: results
        })
    } catch (error) {
        console.error('Error al editar el Proyecto', error);
        res.status(500).json({
            message: 'Error al editar el Proyecto',
            error: error
        })
    }
}

tareasController.cambiarEstadoTarea = async function (req, res) {
  const { id_tarea, id_proyecto, estado } = req.body;
  try {
    await tareasModel.actualizarEstadoTarea(id_tarea, estado);

    const todasFinalizadas = await tareasModel.verificarEstadoTareas(id_proyecto);
    if (todasFinalizadas) {
        await tareasModel.actualizarEstadoProyecto(id_proyecto, 2);
    }

    res.status(200).json({ message: 'Estado de la tarea actualizado' });
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ message: 'Error al cambiar el estado', error });
  }
};

module.exports = tareasController