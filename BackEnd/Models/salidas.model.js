module.exports = (sequelize, Sequelize) => {
    const Salida = sequelize.define("Salida", {
        idSalida: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            field: 'idSalida'
        },
        idTipo: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idTipo'
        },
        idProducto: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idProducto'
        },
        idDepartamentos: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idDepartamentos'
        },
        Cantidad: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'Cantidad'
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idUsuario'
        },
        Fecha: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'Fecha'
        },
        Notas: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: 'Notas'
        }
    }, {
        tableName: 'Salidas',
        timestamps: false
    });

    return Salida;
};
