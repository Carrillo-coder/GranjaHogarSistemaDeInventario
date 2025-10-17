/**
 * Modelo de Lotes usando Sequelize
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
        cantidad: {
            type: Sequelize.INTEGER,
            field: 'cantidad'
        },
        unidadesExistentes: {
            type: Sequelize.INTEGER,
            field: 'unidadesExistentes'
        },
        caducidad: {
            type: Sequelize.DATE,
            field: 'caducidad'
        },
        activo: {
            type: Sequelize.BOOLEAN,
            field: 'activo'
        },
        idProducto: {
            type: Sequelize.INTEGER,
            field: 'idProducto'
        },
        idEntrada: {
            type: Sequelize.INTEGER,
            field: 'idEntrada'
        }
    }, {
        tableName: 'Lotes',
        timestamps: false
    });

    return Lote;
};
