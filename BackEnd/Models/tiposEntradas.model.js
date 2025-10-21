/**
 * Modelo de TiposEntradas usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
  const TipoEntrada = sequelize.define("TipoEntrada", {
    idTipoE: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idTipoE'
    },
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: true, // coincide con la BD
      field: 'nombre',
      validate: {
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/],
          msg: 'El nombre solo puede contener letras y espacios'
        }
      }
    }
  }, {
    tableName: 'TiposEntradas',
    timestamps: false
  });

  return TipoEntrada;
};
