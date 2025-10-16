const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./Models');
const productosRoutes = require('./Routes/productos.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.get('/', (_req, res) => {
  res.json({
    message: 'API Inventario - Productos',
    endpoints: { productos: '/api/inventario/productos' }
  });
});

db.sequelize.sync({ alter: true })
  .then(() => console.log('✅ Sequelize sincronizado'))
  .catch(err => console.error('❌ Error al sincronizar Sequelize:', err.message));

app.use('/api/inventario/productos', productosRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada', path: req.url }));
module.exports = app;
