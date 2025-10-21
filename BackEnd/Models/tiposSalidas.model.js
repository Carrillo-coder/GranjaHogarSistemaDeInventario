/**
 * Modelo de TipoSalida usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
  const TipoSalida = sequelize.define("TipoSalida", {
    idTipoS: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idTipoS'
    },
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,  // ← tras endurecer la BD
      unique: true,      // ← tras crear el índice único
      field: 'nombre'
    }
  }, {
    tableName: 'TiposSalidas', // ← case correcto
    timestamps: false
  });

  return TipoSalida;
};
