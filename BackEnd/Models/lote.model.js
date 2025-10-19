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
            field: 'idLotes'
        },
        unidadesExistentes: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'unidadesExistentes'
        },
        Caducidad: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'Caducidad'
        },
        Activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            field: 'Activo'
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