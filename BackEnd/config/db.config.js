const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',              
    password: 'tecito',              
    database: 'inventario',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        throw error;
    }
};

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Pool de conexiones creado correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error en el pool de conexiones:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    getConnection,
    testConnection
};