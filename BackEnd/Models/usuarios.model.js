const { pool } = require('../config/db.config');

/**
 * Modelo de Usuario
 * Maneja todas las operaciones de base de datos para usuarios
 */
class UsuarioModel {
    
    /**
     * Obtener todos los usuarios activos
     */
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT u.ID_Usuario, u.nombreUsuario, u.nombreCompleto, 
                        u.activo, u.ID_Rol, r.nombre as rolNombre
                 FROM Usuarios u
                 INNER JOIN Roles r ON u.ID_Rol = r.ID_Rol
                 WHERE u.activo = true
                 ORDER BY u.nombreCompleto`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por ID
     */
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT u.ID_Usuario, u.nombreUsuario, u.nombreCompleto, 
                        u.activo, u.ID_Rol, r.nombre as rolNombre
                 FROM Usuarios u
                 INNER JOIN Roles r ON u.ID_Rol = r.ID_Rol
                 WHERE u.ID_Usuario = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por nombre de usuario
     */
    static async findByUsername(nombreUsuario) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM Usuarios WHERE nombreUsuario = ?`,
                [nombreUsuario]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    /**
     * Crear nuevo usuario
     */
    static async create(usuarioData) {
        try {
            const [result] = await pool.query(
                `INSERT INTO Usuarios (nombreUsuario, nombreCompleto, password, activo, ID_Rol) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    usuarioData.nombreUsuario,
                    usuarioData.nombreCompleto,
                    usuarioData.password,
                    usuarioData.activo,
                    usuarioData.ID_Rol
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar usuario existente
     */
    static async update(id, usuarioData) {
        try {
            const [result] = await pool.query(
                `UPDATE Usuarios 
                 SET nombreUsuario = ?, 
                     nombreCompleto = ?, 
                     password = ?, 
                     ID_Rol = ?
                 WHERE ID_Usuario = ?`,
                [
                    usuarioData.nombreUsuario,
                    usuarioData.nombreCompleto,
                    usuarioData.password,
                    usuarioData.ID_Rol,
                    id
                ]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Desactivar usuario (soft delete)
     */
    static async deactivate(id) {
        try {
            const [result] = await pool.query(
                `UPDATE Usuarios SET activo = false WHERE ID_Usuario = ?`,
                [id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar si existe un usuario con ese nombre
     */
    static async existsByUsername(nombreUsuario, excludeId = null) {
        try {
            let query = `SELECT COUNT(*) as count FROM Usuarios WHERE nombreUsuario = ?`;
            let params = [nombreUsuario];

            if (excludeId) {
                query += ` AND ID_Usuario != ?`;
                params.push(excludeId);
            }

            const [rows] = await pool.query(query, params);
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UsuarioModel;