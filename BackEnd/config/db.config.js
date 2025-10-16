module.exports = {
  HOST: "localhost",
  USER: "root", // root
  PASSWORD: "Brittox(04)",
  DB: "bdmockgranja", // inventario
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};