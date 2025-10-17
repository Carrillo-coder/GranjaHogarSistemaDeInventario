/**
 * Modelo de Productos usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("Producto", {
        idProducto: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idProducto'
        },
        nombre: {
            type: Sequelize.STRING(50),
            field: 'nombre'
        },
        presentacion: {
            type: Sequelize.STRING(50),
            field: 'presentacion'
        },
        idCategoria: {
            type: Sequelize.INTEGER,
            field: 'idCategoria'
        }
    }, {
        tableName: 'Productos',
        timestamps: false
    });

    return Producto;
};
