//Esto es para probarlo de momento, si quieren usarlo añadan sus rutas en la línea 10  y agreguen sus endopints en la línea 33 y en la línea 50 tmb rutas, si no les sirve, pídanle ayuda a chat :)

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const categoriasRoutes = require('./Routes/categoria.routes'); // NUEVO
const productosRoutes = require('./Routes/producto.routes');   // NUEVO
const lotesRoutes = require('./Routes/lote.routes'); 

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
            categorias: '/api/inventario/categorias',
            productos: '/api/inventario/productos',
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
app.use('/api/inventario/categorias', categoriasRoutes); // NUEVO
app.use('/api/inventario/productos', productosRoutes);   // NUEVO
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
