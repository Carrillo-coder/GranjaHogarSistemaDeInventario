module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define("Categoria", {
    idCategoria: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre: {
      type: Sequelize.STRING(50)
    }
  }, {
    tableName: "Categoria",
    timestamps: false
  });

  return Categoria;
};