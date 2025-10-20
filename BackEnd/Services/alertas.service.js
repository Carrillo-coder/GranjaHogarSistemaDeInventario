const db = require('../Models');
const { Op, fn, col } = db.Sequelize;

class AlertasService {
  // Productos con algún lote que caduca en <= dias (default 10)
  static async getPorCaducar(dias = 10) {
    try {
      const hoy = new Date();
      const limite = new Date();
      limite.setDate(hoy.getDate() + Number(dias || 10));

      // Por producto: MIN(caducidad) dentro de la ventana
      const rows = await db.Lote.findAll({
        where: {
          activo: true,
          caducidad: { [Op.between]: [hoy, limite] },
        },
        attributes: [
          'idProducto',
          [fn('MIN', col('caducidad')), 'caducidad']  // fecha más próxima por producto
        ],
        include: [{
          model: db.Producto,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'presentacion']
        }],
        group: ['Lote.idProducto', 'producto.idProducto']
      });

      const data = rows.map(r => ({
        idProducto: r.idProducto,
        producto: r.producto?.nombre || '',
        presentacion: r.producto?.presentacion || '',
        fecha: r.get('caducidad')
      }));

      return {
        success: true,
        message: data.length ? 'Productos por caducar obtenidos' : 'No hay productos por caducar en el rango',
        data,
        statusCode: 200
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos por caducar', error: error.message, statusCode: 500 };
    }
  }

  // Productos con stock total (suma de unidadesExistentes) < umbral (default 10)
  static async getBajos(umbral = 10) {
    try {
      const rows = await db.Lote.findAll({
        where: { activo: true },
        attributes: [
          'idProducto',
          [fn('SUM', col('unidadesExistentes')), 'stock']
        ],
        include: [{
          model: db.Producto,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'presentacion']
        }],
        group: ['Lote.idProducto', 'producto.idProducto'],
        having: db.sequelize.where(fn('SUM', col('unidadesExistentes')), { [Op.lt]: Number(umbral || 10) }),
        order: [[fn('SUM', col('unidadesExistentes')), 'ASC']]
      });

      const data = rows.map(r => ({
        idProducto: r.idProducto,
        producto: r.producto?.nombre || '',
        presentacion: r.producto?.presentacion || '',
        cantidad: Number(r.get('stock')) || 0
      }));

      return {
        success: true,
        message: data.length ? 'Productos bajos en inventario' : 'No hay productos por debajo del umbral',
        data,
        statusCode: 200
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos bajos', error: error.message, statusCode: 500 };
    }
  }

  // Productos con stock total >= umbral (default 100)
  static async getAltos(umbral = 100) {
    try {
      const rows = await db.Lote.findAll({
        where: { activo: true },
        attributes: [
          'idProducto',
          [fn('SUM', col('unidadesExistentes')), 'stock']
        ],
        include: [{
          model: db.Producto,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'presentacion']
        }],
        group: ['Lote.idProducto', 'producto.idProducto'],
        having: db.sequelize.where(fn('SUM', col('unidadesExistentes')), { [Op.gte]: Number(umbral || 100) }),
        order: [[fn('SUM', col('unidadesExistentes')), 'DESC']]
      });

      const data = rows.map(r => ({
        idProducto: r.idProducto,
        producto: r.producto?.nombre || '',
        presentacion: r.producto?.presentacion || '',
        cantidad: Number(r.get('stock')) || 0
      }));

      return {
        success: true,
        message: data.length ? 'Productos altos en inventario' : 'No hay productos por encima del umbral',
        data,
        statusCode: 200
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos altos', error: error.message, statusCode: 500 };
    }
  }
}

module.exports = AlertasService;
