const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false // opcional, desactiva logs de SQL
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 🔹 Modelos
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);
db.Producto = require("./producto.model.js")(sequelize, Sequelize);
db.Lote = require("./lote.model.js")(sequelize, Sequelize);

// 🔹 Relaciones

// Un producto pertenece a una categoría
db.Producto.belongsTo(db.Categoria, {
  foreignKey: "idCategoria",
  as: "categoria"
});

// Una categoría tiene muchos productos
db.Categoria.hasMany(db.Producto, {
  foreignKey: "idCategoria",
  as: "productos"
});

// Un producto tiene muchos lotes
db.Producto.hasMany(db.Lote, {
  foreignKey: "idProducto",
  as: "lotes"
});

// Un lote pertenece a un producto
db.Lote.belongsTo(db.Producto, {
  foreignKey: "idProducto",
  as: "producto"
});

module.exports = db;


// const dbConfig = require("../config/db.config.js");
// const Sequelize = require("sequelize");

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     operatorsAliases: false,
//     pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle
//     }
// });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.Usuario = require("./usuarios.model.js")(sequelize, Sequelize);
// db.Rol = require("./roles.model.js")(sequelize, Sequelize);

// db.Rol.hasMany(db.Usuario, { foreignKey: 'ID_Rol', as: 'usuarios' });
// db.Usuario.belongsTo(db.Rol, { foreignKey: 'ID_Rol', as: 'rol' });

// module.exports = db;