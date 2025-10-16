<<<<<<< HEAD
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "tecito",
  DB: "inventario",
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
=======
//Estas son mis credenciales, lo probé localmente en workbench para ver que funcione todo, si lo quieren usar, camben el usar (aunque creo que deberían de tener el mismo) y el password


const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',              
    password: 'NK8WRySxbwM',              
    database: 'granja-hogar',
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
>>>>>>> 1d71a27d232f4d0e79a0d0eadda96f5de5a3e56a
