/**
 * Departamentos.
 * @constructor
 * @param {number} id - departamento id
 * @param {string} nombre - Nombre del departamento
 */
module.exports = (sequelize, Sequelize) => {
    const Departamento = sequelize.define("Departamento", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'idDepartamento'
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            field: 'nombre'
        },
    },
    {
      tableName: 'departamentos',
    }
);

    return Departamento;
};