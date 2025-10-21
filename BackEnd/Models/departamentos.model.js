/**
 * Departamentos.
 * @constructor
 * @param {object} id - departamento id
 * @param {object} nombre - Nombre del departamento
 */
module.exports = (sequelize, Sequelize) => {
    const Departamento = sequelize.define("Departamento", {
        idDepartamento: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idDepartamento'
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            field: 'nombre'
        },
    },
        {
            tableName: 'Departamentos',
            timestamps: false
        }
    );

    return Departamento;
};