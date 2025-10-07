const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db.config');

// Importar rutas
const usuariosRoutes = require('./Routes/usuarios.routes');
const rolesRoutes = require('./Routes/roles.routes');

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS para React Native
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API del Sistema de Inventario - Granja Hogar',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/inventario/usuarios',
            roles: '/api/inventario/roles'
        }
    });
});

// Ruta de salud
app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'Connected' : 'Disconnected'
    });
});

// Rutas de la API
app.use('/api/inventario/usuarios', usuariosRoutes);
app.use('/api/inventario/roles', rolesRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.url
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
});

module.exports = app;