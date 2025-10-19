const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);

db.Producto  = require("./productos.model.js")(sequelize, Sequelize);

db.Lote = require("./lote.model.js")(sequelize, Sequelize);

db.Categoria.hasMany(db.Producto, { foreignKey: 'idCategoria', as: 'productos' });
db.Producto.belongsTo(db.Categoria, { foreignKey: 'idCategoria', as: 'categoria' });

db.Lote.belongsTo(db.Producto, { foreignKey: 'idProducto', as: 'producto' });

module.exports = db;
