const connection = require('../config/connection');

const usuariosModel = {}

usuariosModel.getUsuarios = function () {
    return new Promise((resolve, reject) => {
        const query = `SELECT u.id_usuario,
                              u.nombre as nombre_usuario,
                              u.email,
                              r.nombre as rol,
                              DATE_FORMAT(u.creado_en,'%d-%m-%Y') as creado_en,
                              u.estado
                    FROM usuarios as u
                    INNER JOIN roles as r ON r.id_rol = u.rol`;
        
        connection.query(query, (error, data) => {
            if (error) {
                console.error('Error al realizar la consulta getUsuarios:', error);
                return reject(error);
            }
            resolve(data);
        }) 
    })
}

usuariosModel.crearUsuario = function (data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        connection.query(query, [data.nombre, data.email, data.password, data.rol], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta crearUsuario:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

usuariosModel.consultarUsuario = function (id) {
    return new Promise((resolve, reject)=> {
        const query = `SELECT u.id_usuario,
                              u.nombre as nombre_usuario,
                              u.email,
                              u.password,
                              r.nombre as rol,
                              u.rol as rol,
                              DATE_FORMAT(u.creado_en,'%d-%m-%Y') as creado_en,
                              u.estado
                     FROM usuarios as u
                     INNER JOIN roles as r ON r.id_rol = u.rol
                     WHERE u.id_usuario = ?`;
        connection.query(query, [id], (error, detalles) => {
            if (error) {
                console.error('Error al realizar la consulta consultarUsuario:', error);
                return reject(error);
            }
            resolve(detalles[0]);
        })
    })
}

usuariosModel.desactivarUsuario = function (data) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE usuarios SET estado = ? WHERE id_usuario = ?';
        connection.query(query, [data.estado, data.id], (error, results)=> {
            if (error) {
                console.error('Error al realizar la consulta desactivarUsuario:', error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

usuariosModel.editarUsuario = function (data_params) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE usuarios SET ';
        let data = [];
        let updateFields = [];

        if (data_params.nombre) {
            updateFields.push("nombre = ?");
            data.push(data_params.nombre);
        }
        
        if (data_params.email) {
            updateFields.push("email = ?");
            data.push(data_params.email);
        }
    
        // if (data_params.password) {
        //     updateFields.push("password = ?");
        //     data.push(data_params.password);
        // }
    
        if (data_params.rol) {
            updateFields.push("rol = ?");
            data.push(data_params.rol);
        }

        if (updateFields.length > 0) {
            query += updateFields.join(", ");
            query += " WHERE id_usuario = ? ";
            data.push(data_params.id)

        connection.query(query, data, (error, results) => {
            if (error) {
                console.error('Error al realizar editarUsuario', error);
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

module.exports = usuariosModel;