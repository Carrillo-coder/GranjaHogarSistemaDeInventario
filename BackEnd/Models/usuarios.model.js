/**
 * Modelo de Usuario usando Sequelize
 * @param {object} sequelize - Instancia de Sequelize
 * @param {object} Sequelize - Constructor de Sequelize
 */
module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define("Usuario", {
    idUsuario: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idUsuario'
    },
    nombreUsuario: {
      type: Sequelize.STRING(50),   // ← coincide con BD endurecida
      allowNull: false,
      unique: true,
      field: 'nombreUsuario'
    },
    nombreCompleto: {
      type: Sequelize.STRING(100),  // ← coincide con BD endurecida
      allowNull: false,
      field: 'nombreCompleto'
    },
    password: {
      type: Sequelize.STRING(255),  // ← coincide con BD endurecida
      allowNull: false,
      field: 'password'
    },
    activo: {
      type: Sequelize.BOOLEAN,      // Sequelize mapea a TINYINT(1)/BIT(1)
      allowNull: false,
      defaultValue: true,           // ← DEFAULT b'1' en BD
      field: 'activo'
    },
    idRol: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'idRol',
      references: {
        model: 'Roles',
        key: 'idRol'
      }
    }
  }, {
    tableName: 'Usuarios',          // ← case correcto
    timestamps: false
  });

  return Usuario;
};
