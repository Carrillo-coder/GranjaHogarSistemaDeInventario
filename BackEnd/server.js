//Es el server para probar que sus endpoints funcionen, no tienen que cambiar nada

const app = require('./app');
const { testConnection } = require('./config/db.config');

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        console.log('🔄 Verificando conexión a la base de datos...');
        const isConnected = await testConnection();
        
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            console.error('Verifica las credenciales en config/db.config.js');
            process.exit(1);
        }

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
            console.log('========================================\n');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
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
