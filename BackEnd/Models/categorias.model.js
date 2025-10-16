module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define("Categoria", {
    idCategoria: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idCategoria'
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El nombre de categoría es obligatorio' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/],
          msg: 'La categoría solo permite letras y espacios'
        }
      }
    }
  }, {
    tableName: 'Categorias',
    timestamps: false
  });

  return Categoria;
};
