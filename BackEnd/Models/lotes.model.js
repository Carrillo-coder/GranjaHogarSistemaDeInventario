/**
 * Modelo de Rol usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Lote = sequelize.define("Lote", {
        idLotes: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idLote'
        },
        unidadesExistentes: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'unidadesExistentes'
        },
        caducidad: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'caducidad'
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
            allowNull: true,
            field: 'idEntrada',
            references: {
                model: 'Entradas',
                key: 'idEntrada'
            }
        }
    }, {
        tableName: 'Lotes',
        timestamps: false
    });

    return Lote;
};
