const { sequelize } = require('../config/db.config');
const Sequelize = require('sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuarios = require('./usuarios.model.js')(sequelize, Sequelize);
db.Roles = require('./roles.model.js')(sequelize, Sequelize);
db.TiposSalidas = require('./tiposSalidas.model.js')(sequelize, Sequelize);
db.Categoria = require('./categoria.model.js')(sequelize, Sequelize);

// Relationships
// Example: db.Usuarios.belongsTo(db.Roles, { foreignKey: 'ID_Rol' });

module.exports = db;