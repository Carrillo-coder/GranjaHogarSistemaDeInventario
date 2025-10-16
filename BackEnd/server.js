const app = require('./app');
const db = require('./Models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('🔌 Conexión a MySQL OK');
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  } catch (e) {
    console.error('❌ No se pudo conectar a MySQL:', e.message);
    process.exit(1);
  }
})();
