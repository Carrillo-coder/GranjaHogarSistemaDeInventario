const { pool } = require('../config/db.config');

class RolModel {
    
 
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