module.exports = (sequelize, Sequelize) => {
    const Salida = sequelize.define("Salida", {
        idSalida: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idSalida'
        },
        idTipo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idTipo'
        },
        idProducto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idProducto'
        },
        idDepartamento: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idDepartamento'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'cantidad'
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'idUsuario'
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