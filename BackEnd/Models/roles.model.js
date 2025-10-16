/**
 * Modelo de Rol usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
    const Rol = sequelize.define("Rol", {
        idRol: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idRol'
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            field: 'nombre'
        }
    }, {
        tableName: 'Roles',
        timestamps: false
    });

    return Rol;
};