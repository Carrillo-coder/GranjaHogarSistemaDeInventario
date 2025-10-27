module.exports = {
  HOST: 'localhost',
  USER: 'gh_user',
  PASSWORD: 'gh_password',
  DB: 'granja_hogar',
  dialect: 'mysql',
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
};