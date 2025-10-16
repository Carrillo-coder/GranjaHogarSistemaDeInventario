const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// SOLO estos dos modelos:
db.Categoria = require("./categorias.model.js")(sequelize, Sequelize);
db.Producto  = require("./productos.model.js")(sequelize, Sequelize);

// Asociación
db.Categoria.hasMany(db.Producto, { foreignKey: "idCategoria", as: "productos" });
db.Producto.belongsTo(db.Categoria, { foreignKey: "idCategoria", as: "categoria" });

module.exports = db;
