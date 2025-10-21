module.exports = {
    HOST: "localhost",      // tu host, en XAMPP normalmente localhost
    USER: "root",           // usuario de MySQL, por defecto "root"
    PASSWORD: "Brittox(04)",           // contraseña de MySQL, por defecto vacío en XAMPP
    DB: "BDMockgranja",      // nombre de tu base de datos
    dialect: "mysql",       // porque usamos MySQL
    pool: {
        max: 5,             // conexiones máximas
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
