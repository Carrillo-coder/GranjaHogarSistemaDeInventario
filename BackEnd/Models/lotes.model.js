
module.exports = (sequelize, Sequelize) => {
    const Lote = sequelize.define("Lote", {
        idLotes: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idLotes'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'cantidad'
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            field: 'activo'
        },
        idProducto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idProducto',
            references: {
                model: 'Productos',
                key: 'idProducto'
            }
        },
        idEntrada: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idEntrada',
            references: {
                model: 'Entradas',
                key: 'idEntradas'
            }
        }
    }, {
        tableName: 'Lotes',
        timestamps: false
    });

    return Lote;
};
