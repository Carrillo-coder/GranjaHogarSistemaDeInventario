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
db.TiposSalidas = require("./tiposSalidas.model.js")(sequelize, Sequelize);
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);

db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol', as: 'usuarios' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol', as: 'rol' });

module.exports = db;