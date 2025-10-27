// server.js
require('dotenv').config();

const app = require('./app');
const db = require('./Models');

const PORT = process.env.PORT || 5000;

// Opcional: advertir si falta JWT_SECRET (no bloquea el arranque de dev)
if (!process.env.JWT_SECRET) {
  console.warn('⚠  JWT_SECRET no está definido. Define la variable de entorno o .env para emitir tokens.');
}

const startServer = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await db.sequelize.authenticate();
    await db.sequelize.sync(); // En dev puedes usar { alter: true } si lo necesitas
    console.log('✅ Conexión y sincronización de Sequelize listas');

    // Importante: escuchar en 0.0.0.0 para acceder desde el celular en la misma red
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n========================================');
      console.log('🚀 Servidor iniciado correctamente');
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌐 Local:      http://localhost:${PORT}`);
      console.log(`🌐 En tu LAN:  http://<TU_IP_LOCAL>:${PORT}`);
      console.log(`📊 API Base:   http://<host>:${PORT}/api/inventario`);
      console.log('========================================\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('Verifica las credenciales en config/db.config.js y la conexión a la base de datos.');
    process.exit(1);
  }
};

// Manejadores de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado (Promise):', error);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('❌ Error no manejado (Sync):', error);
  process.exit(1);
});
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer }; // Exportar app para pruebas