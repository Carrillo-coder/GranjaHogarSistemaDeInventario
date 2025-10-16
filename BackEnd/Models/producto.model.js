/**
 * Modelo de Usuario usando Sequelize
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
        Nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'Nombre'
        },
        Presentacion: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'Presentacion'
        },
        idCategoria: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idCategoria',
            references: {
                model: 'Categoria',
                key: 'idCategoria'
            }
        }
    }, {
        tableName: 'Productos',
        timestamps: false
    });

    return Producto;
};
