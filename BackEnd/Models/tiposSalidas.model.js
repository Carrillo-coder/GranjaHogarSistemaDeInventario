/**
 * Modelo de TiposSalidas usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const TiposSalidas = sequelize.define("TiposSalidas", {
        idTipoS: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idTipoS'
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            field: 'nombre'
        }
    }, {
        tableName: 'tipossalidas',
        timestamps: false
    });

    return TiposSalidas;
};