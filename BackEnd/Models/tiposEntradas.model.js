/**
 * Modelo de TiposEntradas usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const TipoEntrada = sequelize.define("TipoEntrada", {
        idTipoE: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idTipoE'
        },
        nombre: {
            type: Sequelize.STRING(50),
            field: 'nombre'
        }
    }, {
        tableName: 'TiposEntradas',
        timestamps: false
    });

    return TipoEntrada;
};
