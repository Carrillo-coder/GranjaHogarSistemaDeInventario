module.exports = (sequelize, Sequelize) => {
    const Salida = sequelize.define("Salida", {
        ID_Salida: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID_Salida'
        },
        ID_Tipo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Tipo'
        },
        ID_Producto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Producto'
        },
        ID_Departamentos: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Departamentos'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'cantidad'
        },
        ID_Usuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Usuario'
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
        tableName: 'Salidas',
        timestamps: false
    });

    return Salida;
};
