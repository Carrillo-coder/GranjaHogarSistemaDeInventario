//Esto es para probarlo de momento, si quieren usarlo añadan sus rutas en la línea 10  y agreguen sus endopints en la línea 33 y en la línea 50 tmb rutas, si no les sirve, pídanle ayuda a chat :)

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const rolesRoutes = require('./routes/roles.routes');
const departamentosRoutes = require('./routes/departamentos.routes');
const entradasRoutes = require('./routes/entradas.routes');
const salidasRoutes = require('./routes/salidas.routes');
const lotesRoutes = require('./routes/lotes.routes');


// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS para React Native
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded
app.use(morgan('tiny')); // Logger de requests

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API del Sistema de Inventario - Granja Hogar',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/inventario/usuarios',
            roles: '/api/inventario/roles',
            departamentos: '/api/inventario/departamentos',
            entradas: '/api/inventario/entradas',
            salidas: '/api/inventario/salidas',
            lotes: '/api/inventario/lotes'
        }
    });
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/inventario/usuarios', usuariosRoutes);
app.use('/api/inventario/roles', rolesRoutes);
app.use('/api/inventario/departamentos', departamentosRoutes);
app.use('/api/inventario/entradas', entradasRoutes);
app.use('/api/inventario/salidas', salidasRoutes);
app.use('/api/inventario/lotes', lotesRoutes);

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
