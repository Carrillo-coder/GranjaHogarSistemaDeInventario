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
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuarios.model.js")(sequelize, Sequelize);
db.Rol = require("./roles.model.js")(sequelize, Sequelize);
db.Entrada = require("./entradas.model.js")(sequelize, Sequelize);
db.Lote = require("./lotes.model.js")(sequelize, Sequelize);
db.Producto = require("./productos.model.js")(sequelize, Sequelize);

db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol', as: 'usuarios' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol', as: 'rol' });
db.Entrada.hasMany(db.Lote, { foreignKey: 'idEntrada', as: 'lotes' });
db.Lote.belongsTo(db.Entrada, { foreignKey: 'idEntrada', as: 'entrada' });
db.Producto.hasMany(db.Lote, { foreignKey: 'idProducto', as: 'lotes' });
db.Lote.belongsTo(db.Producto, { foreignKey: 'idProducto', as: 'producto' });

module.exports = db;