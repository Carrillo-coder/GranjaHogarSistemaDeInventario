const { pool } = require('../config/db.config');

class UsuarioModel {
    

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