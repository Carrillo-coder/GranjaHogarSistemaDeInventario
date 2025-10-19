module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define("Categoria", {
    idCategoria: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'idCategoria'
    },
    Nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      field: 'Nombre',
      validate: {
        notEmpty: { msg: 'El nombre de categoría es obligatorio' },
        is: {
          args: [/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/],
          msg: 'La categoría solo permite letras y espacios'
        }
      }
    }
  }, {
    tableName: 'Categoria',
    timestamps: false
  });

  return Categoria;
};
