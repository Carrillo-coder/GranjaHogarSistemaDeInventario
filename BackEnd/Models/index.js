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
db.Departamento = require("./departamentos.model.js")(sequelize, Sequelize);
db.Salida = require("./salidas.model.js")(sequelize, Sequelize);
db.Producto = require("./productos.model.js")(sequelize, Sequelize);
db.Categoria = require("./categorias.model.js")(sequelize, Sequelize);
db.Lote = require("./lotes.model.js")(sequelize, Sequelize);
db.Entrada = require("./entradas.model.js")(sequelize, Sequelize);
db.TipoEntrada = require("./tiposEntradas.model.js")(sequelize, Sequelize);
db.TipoSalida = require("./tiposSalidas.model.js")(sequelize, Sequelize);


db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol' });

// Usuarios - Entradas / Salidas
db.Usuario.hasMany(db.Entrada, { foreignKey: 'idUsuario' });
db.Entrada.belongsTo(db.Usuario, { foreignKey: 'idUsuario' });

db.Usuario.hasMany(db.Salida, { foreignKey: 'idUsuario' });
db.Salida.belongsTo(db.Usuario, { foreignKey: 'idUsuario' });

// TiposEntradas - Entradas
db.TipoEntrada.hasMany(db.Entrada, { foreignKey: 'idTipo' });
db.Entrada.belongsTo(db.TipoEntrada, { foreignKey: 'idTipo' });

// TiposSalidas - Salidas
db.TipoSalida.hasMany(db.Salida, { foreignKey: 'idTipo' });
db.Salida.belongsTo(db.TipoSalida, { foreignKey: 'idTipo' });

// Departamentos - Salidas
db.Departamento.hasMany(db.Salida, { foreignKey: 'idDepartamento' });
db.Salida.belongsTo(db.Departamento, { foreignKey: 'idDepartamento' });

// Producto.js
db.Producto.belongsTo(db.Categoria, { foreignKey: 'idCategoria', as: 'Categoria' });
db.Categoria.hasMany(db.Producto, { foreignKey: 'idCategoria', as: 'Productos' });

// Productos - Lotes / Salidas
db.Producto.hasMany(db.Lote, { foreignKey: 'idProducto' });
db.Lote.belongsTo(db.Producto, { foreignKey: 'idProducto' });

db.Producto.hasMany(db.Salida, { foreignKey: 'idProducto' });
db.Salida.belongsTo(db.Producto, { foreignKey: 'idProducto' });

// Entradas - Lotes
db.Entrada.hasMany(db.Lote, { foreignKey: 'idEntrada' });
db.Lote.belongsTo(db.Entrada, { foreignKey: 'idEntrada' });

module.exports = db;