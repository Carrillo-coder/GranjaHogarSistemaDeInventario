/**
 * Modelo de Producto usando Sequelize ESTE PRODUCTOS.MODEL.ES TEMPORAL, PARA PODER PROBAR ENDPOINTS
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
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'nombre'
        },
        descripcion: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: 'descripcion'
        },
        precio: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: true,
            field: 'precio'
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            field: 'activo'
        }
    }, {
        tableName: 'Productos',
        timestamps: false
    });

    return Producto;
};
