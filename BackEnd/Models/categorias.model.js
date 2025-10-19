/**
 * Modelo de Categoria usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define("Categoria", {
        idCategoria: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idCategoria'
        },
        nombre: {
            type: Sequelize.STRING(50),
            field: 'nombre'
        }
    }, {
        tableName: 'Categoria',
        timestamps: false
    });

    return Categoria;
};
