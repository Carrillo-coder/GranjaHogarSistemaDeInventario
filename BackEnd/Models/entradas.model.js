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
            allowNull: false,
            field: 'idTipo'
        },
        proveedor: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'proveedor'
        },
        idUsuario: {
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