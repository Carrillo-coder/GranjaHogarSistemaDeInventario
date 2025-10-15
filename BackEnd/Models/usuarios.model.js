/**
 * Modelo de Usuario usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("Usuario", {
        ID_Usuario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID_Usuario'
        },
        nombreUsuario: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            field: 'nombreUsuario'
        },
        nombreCompleto: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'nombreCompleto'
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false,
            field: 'password'
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            field: 'activo'
        },
        ID_Rol: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_Rol',
            references: {
                model: 'Roles',
                key: 'ID_Rol'
            }
        }
    }, {
        tableName: 'Usuarios',
        timestamps: false
    });

    return Usuario;
};