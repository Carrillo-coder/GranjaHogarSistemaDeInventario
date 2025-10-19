module.exports = (sequelize, Sequelize) => {
  const Producto = sequelize.define("Producto", {
    idProducto: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idProducto'
    },
    Nombre: {
      type: Sequelize.STRING(120),
      allowNull: false,
      field: 'Nombre',
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/],
          msg: 'Nombre inválido (solo letras y espacios)'
        }
      }
    },
    Presentacion: {
      type: Sequelize.STRING(120),
      allowNull: false,
      field: 'Presentacion',
      validate: {
        notEmpty: { msg: 'La presentación es obligatoria' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/],
          msg: 'Presentación inválida (letras/números y - . , / ( ) x)'
        }
      }
    },
    idCategoria: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'idCategoria'
    }
  }, {
    tableName: 'Productos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['Nombre', 'Presentacion'], name: 'ux_nombre_presentacion' }
    ]
  });

  return Producto;
};
