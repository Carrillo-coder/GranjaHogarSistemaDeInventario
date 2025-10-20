const app = require('./app');
const db = require('./Models');

const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Sincronizar base de datos
        console.log('🔄 Conectando a la base de datos...');
        
        await db.sequelize.sync();
        console.log('✅ Conexión exitosa a la base de datos');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n========================================');
            console.log('🚀 Servidor iniciado correctamente');
            console.log(`📡 Puerto: ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 API Base: http://localhost:${PORT}/api/inventario`);
            console.log('========================================\n');
            console.log('Endpoints disponibles:');
            console.log(`  GET    http://localhost:${PORT}/api/inventario/usuarios`);
            console.log(`  GET    http://localhost:${PORT}/api/inventario/usuarios/:id`);
            console.log(`  POST   http://localhost:${PORT}/api/inventario/usuarios`);
            console.log(`  PUT    http://localhost:${PORT}/api/inventario/usuarios/:id`);
            console.log(`  DELETE http://localhost:${PORT}/api/inventario/usuarios/:id`);
            console.log(`  GET    http://localhost:${PORT}/api/inventario/roles`);
            console.log(`  GET    http://localhost:${PORT}/api/inventario/salidas`);
            console.log(`  GET    http://localhost:${PORT}/api/inventario/salidas/id`);
            console.log(`  POST    http://localhost:${PORT}/api/inventario/salidas`);
            console.log('========================================\n');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        console.error('Verifica las credenciales en config/db.config.js');
        process.exit(1);
    }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Error no manejado:', error);
    process.exit(1);
});

// Iniciar servidor
startServer();