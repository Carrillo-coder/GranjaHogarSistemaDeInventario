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
        idDepartamento: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idDepartamento'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'cantidad'
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'idUsuario'
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: true,
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