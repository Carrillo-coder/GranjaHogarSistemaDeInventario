// productos.model.js
module.exports = (sequelize, Sequelize) => {
  const Producto = sequelize.define("Producto", {
    idProducto: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idProducto'
    },
    nombre: {
      type: Sequelize.STRING(50),     // ← coincide con VARCHAR(50)
      allowNull: false,               // ← NO NULL en BD
      field: 'nombre',
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/],
          msg: 'Nombre inválido (solo letras y espacios)'
        }
      }
    },
    presentacion: {
      type: Sequelize.STRING(50),     // ← coincide con VARCHAR(50)
      allowNull: false,               // ← NO NULL en BD
      field: 'presentacion',
      validate: {
        notEmpty: { msg: 'La presentación es obligatoria' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,\/()xX]+$/], // escapada la /
          msg: 'Presentación inválida (letras/números y - . , / ( ) x)'
        }
      }
    },
    idCategoria: {
      type: Sequelize.INTEGER,
      allowNull: false,               // ← NO NULL en BD
      field: 'idCategoria'
    }
  }, {
    tableName: 'Productos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['nombre', 'presentacion'], name: 'ux_nombre_presentacion' }
    ]
  });

  return Producto;
};
