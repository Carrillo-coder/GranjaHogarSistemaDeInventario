const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inventario', 'root', 'tecito', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        return true;
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error.message);
        return false;
    }
};

module.exports = {
    sequelize,
    testConnection
};