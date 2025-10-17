/**
 * Modelo de TiposSalidas usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const TipoSalida = sequelize.define("TipoSalida", {
        idTipoS: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idTipoS'
        },
        nombre: {
            type: Sequelize.STRING(50),
            field: 'nombre'
        }
    }, {
        tableName: 'TiposSalidas',
        timestamps: false
    });

    return TipoSalida;
};
