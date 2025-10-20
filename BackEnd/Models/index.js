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

// --- Definición de Modelos (Unificados) ---
db.Usuario = require("./usuarios.model.js")(sequelize, Sequelize);
db.Rol = require("./roles.model.js")(sequelize, Sequelize);
db.Producto = require("./productos.model.js")(sequelize, Sequelize);
db.Entrada = require("./entradas.model.js")(sequelize, Sequelize);
db.Salida = require("./salidas.model.js")(sequelize, Sequelize);
db.Departamento = require("./departamentos.model.js")(sequelize, Sequelize);
db.TipoEntrada = require("./tiposEntradas.model.js")(sequelize, Sequelize);
db.Categoria = require("./categorias.model.js")(sequelize, Sequelize); 
db.Lote = require("./lotes.model.js")(sequelize, Sequelize); 
db.TipoSalida = require("./tiposSalidas.model.js")(sequelize, Sequelize);


// --- Definición de Asociaciones (Unificadas y Estandarizadas) ---

// Rol <-> Usuario (1:M)
db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol', as: 'usuarios' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol', as: 'rol' });

// Categoria <-> Producto (1:M)
db.Categorias.hasMany(db.Producto, { foreignKey: "idCategoria", as: "productos" });
db.Producto.belongsTo(db.Categorias, { foreignKey: "idCategoria", as: "categorias" });

// Producto <-> Lote (1:M)
db.Producto.hasMany(db.Lote, { foreignKey: "idProducto", as: "lotes" });
db.Lote.belongsTo(db.Producto, { foreignKey: "idProducto", as: "producto" });

// Producto <-> Salida (1:M)
db.Producto.hasMany(db.Salida, { foreignKey: 'idProducto', as: 'salidas' });
db.Salida.belongsTo(db.Producto, { foreignKey: 'idProducto', as: 'producto' });

// Entrada <-> Lote (1:M)
db.Entrada.hasMany(db.Lote, { foreignKey: 'idEntrada', as: 'lotes' });
db.Lote.belongsTo(db.Entrada, { foreignKey: 'idEntrada', as: 'entrada' });

// Usuario <-> Entrada (1:M)
db.Usuario.hasMany(db.Entrada, { foreignKey: 'idUsuario', as: 'entradas' });
db.Entrada.belongsTo(db.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// Usuario <-> Salida (1:M)
db.Usuario.hasMany(db.Salida, { foreignKey: 'idUsuario', as: 'salidas' });
db.Salida.belongsTo(db.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// TipoEntrada <-> Entrada (1:M)
db.TipoEntrada.hasMany(db.Entrada, { foreignKey: 'idTipo', as: 'entradas' });
db.Entrada.belongsTo(db.TipoEntrada, { foreignKey: 'idTipo', as: 'tipoEntrada' });

// TipoSalida <-> Salida (1:M)
db.TipoSalida.hasMany(db.Salida, { foreignKey: 'idTipo', as: 'salidas' });
db.Salida.belongsTo(db.TipoSalida, { foreignKey: 'idTipo', as: 'tipoSalida' });

// Departamento <-> Salida (1:M)
db.Departamento.hasMany(db.Salida, { foreignKey: 'idDepartamento', as: 'salidas' });
db.Salida.belongsTo(db.Departamento, { foreignKey: 'idDepartamento', as: 'departamento' });


module.exports = db;
