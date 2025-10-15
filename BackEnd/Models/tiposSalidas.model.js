/**
 * @typedef TiposSalidas
 * @property {integer} idTipoSalida
 * @property {string} Nombre.required
 */
module.exports = (sequelize, Sequelize) => {
    const TiposSalidas = sequelize.define("TiposSalidas", {
        idTipoSalida: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'tipossalidas'
    });

    return TiposSalidas;
};