/**
 * Modelo de Entradas usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Entrada = sequelize.define("Entrada", {
        idEntrada: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idEntrada'
        },
        idTipo: {
            type: Sequelize.INTEGER,
            field: 'idTipo'
        },
        proveedor: {
            type: Sequelize.STRING(50),
            field: 'proveedor'
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            field: 'idUsuario'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        notas: {
            type: Sequelize.STRING(225),
            field: 'notas'
        }
    }, {
        tableName: 'Entradas',
        timestamps: false
    });

    return Entrada;
};
