const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./Models');

const usuariosRoutes = require('./Routes/usuarios.routes');
const rolesRoutes = require('./Routes/roles.routes');
const productosRoutes = require('./Routes/productos.routes');
const departamentosRoutes = require('./Routes/departamentos.routes');
const entradasRoutes = require('./Routes/entradas.routes');
const salidasRoutes = require('./Routes/salidas.routes');
const lotesRoutes = require('./Routes/lotes.routes');
const categoriaRoutes = require('./Routes/categoria.routes');
const tiposSalidasRoutes = require('./Routes/tiposSalidas.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));


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
            lotes: '/api/inventario/lotes'
        }
    });
});

// Sincronización con la Base de Datos
db.sequelize.sync({ alter: true })
  .then(() => console.log('✅ Sequelize sincronizado'))
  .catch(err => console.error('❌ Error al sincronizar Sequelize:', err.message));


// --- Rutas de la API (Registradas una sola vez) ---
app.use('/api/inventario/usuarios', usuariosRoutes);
app.use('/api/inventario/roles', rolesRoutes);
app.use('/api/inventario/productos', productosRoutes);
app.use('/api/inventario/departamentos', departamentosRoutes);
app.use('/api/inventario/entradas', entradasRoutes);
app.use('/api/inventario/salidas', salidasRoutes);
app.use('/api/inventario/lotes', lotesRoutes);
app.use('/api/inventario/categorias', categoriaRoutes);
app.use('/api/inventario/tiposSalidas', tiposSalidasRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.url
    });
});

app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
});


module.exports = app;


