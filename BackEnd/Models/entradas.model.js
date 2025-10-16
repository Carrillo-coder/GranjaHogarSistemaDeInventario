
module.exports = (sequelize, Sequelize) => {
    const Entrada = sequelize.define("Entrada", {
        ID_Entrada: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID_Entrada'
        },
        ID_Tipo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Tipo'
        },
        proveedor: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'proveedor'
        },
        ID_Usuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Usuario',
            references: {
                model: 'Usuarios',
                key: 'ID_Usuario'
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
