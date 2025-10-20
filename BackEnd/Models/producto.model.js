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
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'nombre'
        },
        presentacion: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'presentacion'
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
