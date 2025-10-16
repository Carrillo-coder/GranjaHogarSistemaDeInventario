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
db.Producto  = require("./productos.model.js")(sequelize, Sequelize);
db.Usuario = require("./usuarios.model.js")(sequelize, Sequelize);
db.Rol = require("./roles.model.js")(sequelize, Sequelize);
db.TiposSalidas = require("./tiposSalidas.model.js")(sequelize, Sequelize);
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);

db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol', as: 'usuarios' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol', as: 'rol' });
db.Salida = require('./salidas.model')(sequelize, Sequelize);

// Asociación
db.Categoria.hasMany(db.Producto, { foreignKey: "idCategoria", as: "productos" });
db.Producto.belongsTo(db.Categoria, { foreignKey: "idCategoria", as: "categoria" });

module.exports = db;
