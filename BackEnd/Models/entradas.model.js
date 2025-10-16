
module.exports = (sequelize, Sequelize) => {
    const Entrada = sequelize.define("Entrada", {
        ID_Entrada: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idEntrada'
        },
        ID_Tipo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idTipo'
        },
        proveedor: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'proveedor'
        },
        ID_Usuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idUsuario',
            references: {
                model: 'Usuarios',
                key: 'idUsuario'
            }
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'fecha'
        },
        notas: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: 'notas'
        }
    }, {
        tableName: 'Entradas',
        timestamps: false
    });

    return Entrada;
};
