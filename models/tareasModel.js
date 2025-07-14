const connection = require('../config/connection');

const tareasModel = {}

tareasModel.getProyectos = function () {
    return new Promise((resolve, reject) => {
        const query = `SELECT p.id_proyecto,
                              p.nombre,
                              p.descripcion,
                              u.nombre as creado_por,
                              u.id_usuario,
                              p.estado,
                              ep.nombre as nombre_estado,
                              COUNT(DISTINCT pu.id_usuario) AS total_usuarios,
                              COUNT(DISTINCT t.id_tarea) AS total_tareas,
                              DATE_FORMAT(p.creado_en,'%d-%m-%Y') as creado_en
                        FROM proyectos as p
                        INNER JOIN usuarios as u ON u.id_usuario = p.creado_por
                        INNER JOIN estado_proyectos as ep ON ep.id_estado_proyecto = p.estado
                        LEFT JOIN proyecto_usuarios as pu ON pu.id_proyecto = p.id_proyecto
                        LEFT JOIN tareas as t ON t.id_proyecto = p.id_proyecto
                        WHERE p.estado IN (1, 2, 3)
                        GROUP BY p.id_proyecto`;

        connection.query(query, (error, data) => {
            if (error) {
                console.error('Error al realizar la consulta getProyectos:', error);
                return reject(error);
            }
            resolve(data);
        }) 
    })
}

tareasModel.getUsersActivos = function () {
    return new Promise((resolve, reject) => {
        const query = `SELECT u.id_usuario,
                              u.nombre as nombre_usuario,
                              u.estado
                    FROM usuarios as u
                    WHERE u.estado = 1`;
        
        connection.query(query, (error, data) => {
            if (error) {
                console.error('Error al realizar la consulta getUsersActivos:', error);
                return reject(error);
            }
            resolve(data);
        }) 
    })
}

tareasModel.consultarAsignados = function (id) {
    return new Promise((resolve, reject)=> {
        const query = `SELECT pu.id_proyecto,
                              pu.id_usuario,
                              u.nombre,
                              u.email
                    FROM proyecto_usuarios as pu
                    INNER JOIN usuarios as u ON u.id_usuario = pu.id_usuario
                    WHERE pu.id_proyecto = ? and pu.estado = 1`;
        connection.query(query, [id], (error, detalles) => {
            if (error) {
                console.error('Error al realizar la consulta consultarAsignados:', error);
                return reject(error);
            }
            resolve(detalles);
        })
    })
}

tareasModel.consultarTareas = function (id_proyecto) {
    return new Promise((resolve, reject)=> {
        const query = `SELECT t.id_tarea,
                              t.titulo,
                              t.descripcion,
                              t.estado_tarea,
                              t.id_proyecto,
                              et.nombre as nombre_estado,
                              u.nombre as nombre_usuario
                    FROM tareas as t
                    LEFT JOIN estado_tareas as et ON et.id_estado_tarea = t.estado_tarea
                    LEFT JOIN usuarios as u ON u.id_usuario = t.asignado_a
                    WHERE t.id_proyecto = ?`;
        connection.query(query, [id_proyecto], (error, detalles) => {
            if (error) {
                console.error('Error al realizar la consulta consultarTareas:', error);
                return reject(error);
            }
            resolve(detalles);
        })
    })
}

tareasModel.usuariosProyecto = function (id_proyecto) {
    return new Promise((resolve, reject)=> {
        const query = `SELECT pu.id_proyecto,
                              u.id_usuario,
                              u.nombre as nombre_usuario
                    FROM proyecto_usuarios as pu
                    INNER JOIN usuarios as u ON u.id_usuario = pu.id_usuario
                    WHERE pu.id_proyecto = ?`;
        connection.query(query, [id_proyecto], (error, detalles) => {
            if (error) {
                console.error('Error al realizar la consulta usuariosProyecto:', error);
                return reject(error);
            }
            resolve(detalles);
        })
    })
}

tareasModel.consultarProyecto = function (id) {
    return new Promise((resolve, reject)=> {
        const query = `SELECT p.id_proyecto,
                              p.nombre,
                              p.descripcion,
                              u.nombre as creado_por,
                              ep.nombre as nombre_estado,
                              DATE_FORMAT(p.creado_en,'%d-%m-%Y') as creado_en
                       FROM proyectos as p
                       INNER JOIN usuarios as u ON u.id_usuario = p.creado_por
                       INNER JOIN estado_proyectos as ep ON ep.id_estado_proyecto = p.estado
                       WHERE p.id_proyecto = ?`;

        connection.query(query, [id], (error, detalles) => {
            if (error) {
                console.error('Error al realizar la consulta consultarProyecto:', error);
                return reject(error);
            }
            resolve(detalles[0])
        })
    })
}

tareasModel.crearProyecto = function (data) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO proyectos (nombre, descripcion, creado_por) VALUES (?, ?, ?)`;
        connection.query(query, [data.nombre, data.descripcion, data.creado_por], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta crearProyecto:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

tareasModel.eliminarProyecto = function (data) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE proyectos SET estado = ? WHERE id_proyecto = ?';
        connection.query(query, [data.estado, data.id], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta eliminarProyecto:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

tareasModel.asignarUsuarioProyecto = function (id_proyecto, id_usuario) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO proyecto_usuarios (id_proyecto, id_usuario) VALUES (?, ?)';
        connection.query(query, [id_proyecto, id_usuario], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta asignarUsuarioProyecto:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

tareasModel.agregarTareas = function (data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tareas (titulo, descripcion, id_proyecto, asignado_a) VALUES (?, ?, ?, ?)';
        connection.query(query, [data.titulo, data.descripcion, data.id_proyecto, data.asignado_a], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta agregarTareas:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

tareasModel.editarProyecto = function (data_params) {
       return new Promise((resolve, reject) => {
        let query = 'UPDATE proyectos SET ';
        let data = [];
        let updateFields = [];

        if (data_params.nombre) {
            updateFields.push("nombre = ?");
            data.push(data_params.nombre);
        }
        
        if (data_params.descripcion) {
            updateFields.push("descripcion = ?");
            data.push(data_params.descripcion);
        }

        if (updateFields.length > 0) {
            query += updateFields.join(", ");
            query += " WHERE id_proyecto = ? ";
            data.push(data_params.id_proyecto)

        connection.query(query, data, (error, results) => {
            if (error) {
                console.error('Error al realizar editarProyecto', error);
                resolve([])
            } else {
                resolve(results);
            }
        })
        } else {
            resolve({ message: 'No hay campos para actualizar'})
        }
    }) 
}

tareasModel.actualizarEstadoTarea = function (id_tarea, estado) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE tareas SET estado_tarea = ? WHERE id_tarea = ?`;
    connection.query(query, [estado, id_tarea], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

tareasModel.verificarEstadoTareas = function (id_proyecto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) AS pendientes
            FROM tareas
            WHERE id_proyecto = ? AND estado_tarea NOT IN (2, 3) -- 2: Finalizado, 3: Cancelado
        `;
        connection.query(query, [id_proyecto], (error, results) => {
            if (error) return reject(error);
            resolve(results[0].pendientes === 0); 
        });
    });
};

tareasModel.actualizarEstadoProyecto = function (id_proyecto, nuevoEstado) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE proyectos SET estado = ? WHERE id_proyecto = ?`;
        connection.query(query, [nuevoEstado, id_proyecto], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

module.exports = tareasModel;