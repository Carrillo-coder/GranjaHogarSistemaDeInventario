/**
 * Modelo de Lote usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
  const Lote = sequelize.define("Lote", {
    idLotes: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idLotes'
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'cantidad'
    },
    unidadesExistentes: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'unidadesExistentes'
    },
    caducidad: {
      type: Sequelize.DATEONLY, // solo fecha, sin hora
      allowNull: true,
      field: 'caducidad'
    },
    activo: {
      type: Sequelize.BOOLEAN, // Sequelize traduce BIT(1) ↔ BOOLEAN
      allowNull: true,
      field: 'activo'
    },
    idProducto: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'idProducto',
      references: {
        model: 'Productos',
        key: 'idProducto'
      }
    },
    idEntrada: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'idEntrada',
      references: {
        model: 'Entradas',
        key: 'idEntrada'
      }
    }
  }, {
    tableName: 'Lotes',
    timestamps: false
  });

  return Lote;
};
