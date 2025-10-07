const { pool } = require('../config/db.config');

/**
 * Modelo de Rol
 * Maneja todas las operaciones de base de datos para roles
 */
class RolModel {
    
    /**
     * Obtener todos los roles
     */
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT ID_Rol, nombre FROM Roles ORDER BY nombre`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar rol por ID
     */
    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT ID_Rol, nombre FROM Roles WHERE ID_Rol = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar si existe un rol
     */
    static async exists(id) {
        try {
            const [rows] = await pool.query(
                `SELECT COUNT(*) as count FROM Roles WHERE ID_Rol = ?`,
                [id]
            );
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RolModel;