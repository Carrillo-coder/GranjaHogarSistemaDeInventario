// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Routers
const usuariosRoutes = require('./Routes/usuarios.routes');
const rolesRoutes = require('./Routes/roles.routes');
const productosRoutes = require('./Routes/productos.routes');
const departamentosRoutes = require('./Routes/departamentos.routes');
const entradasRoutes = require('./Routes/entradas.routes');
const salidasRoutes = require('./Routes/salidas.routes');
const lotesRoutes = require('./Routes/lotes.routes');
const categoriasRoutes = require('./Routes/categorias.routes');
const tiposSalidasRoutes = require('./Routes/tiposSalidas.routes');
const alertasRoutes = require('./Routes/alertas.routes');
const logInRoutes = require('./Routes/logIn.routes');

const app = express();

// Middlewares globales
app.use(cors()); // en dev, abre todo. En prod configura origin.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Endpoint raÃ­z informativo
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Inventario - Granja Hogar',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/inventario/usuarios',
      roles: '/api/inventario/roles',
      productos: '/api/inventario/productos',
      categorias: '/api/inventario/categorias',
      departamentos: '/api/inventario/departamentos',
      tiposSalidas: '/api/inventario/tiposSalidas',
      entradas: '/api/inventario/entradas',
      salidas: '/api/inventario/salidas',
      lotes: '/api/inventario/lotes',
      logIn: '/api/inventario/logIn'
    }
  });
});

// ====== Rutas de la API ======
app.use('/api/inventario/usuarios', usuariosRoutes);
app.use('/api/inventario/roles', rolesRoutes);
app.use('/api/inventario/productos', productosRoutes);
app.use('/api/inventario/departamentos', departamentosRoutes);
app.use('/api/inventario/entradas', entradasRoutes);
app.use('/api/inventario/salidas', salidasRoutes);
app.use('/api/inventario/lotes', lotesRoutes);
app.use('/api/inventario/categorias', categoriasRoutes);
app.use('/api/inventario/tiposSalidas', tiposSalidasRoutes);
app.use('/api/inventario/alertas', alertasRoutes);
app.use('/api/inventario/logIn', logInRoutes);

// 404 para rutas no existentes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.url
  });
});

// Manejador de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: error.message
  });
});

module.exports = app;
