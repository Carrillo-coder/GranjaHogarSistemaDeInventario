module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: 'vsbd55_',
  DB: "inventarioss",
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
