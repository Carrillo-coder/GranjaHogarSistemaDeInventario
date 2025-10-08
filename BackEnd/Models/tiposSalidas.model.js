const { pool } = require('../config/db.config');

class TiposSalidasModel {
    
 
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT idTipoS, Nombre FROM TiposSalidas ORDER BY Nombre`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TiposSalidasModel;