// Services/alertas.service.js
const db = require('../Models');
const { Op, fn, col } = db.Sequelize;
const AlertaVO = require('../ValueObjects/alertas.vo');

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d)   { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function diffDays(a, b) {
  const MS = 24 * 60 * 60 * 1000;
  return Math.ceil((startOfDay(b) - startOfDay(a)) / MS);
}

class AlertasService {

  /**
   * Productos con algún lote que caduca en <= dias (default 10)
   * Devuelve la fecha mínima de caducidad por producto dentro del rango.
   */
  static async getPorCaducar(dias = 10) {
    try {
      const hoy = startOfDay(new Date());
      const limite = endOfDay(new Date(hoy));
      limite.setDate(limite.getDate() + Number(dias || 10));

      const rows = await db.Lote.findAll({
        where: {
          activo: true,
          caducidad: { [Op.between]: [hoy, limite] },
        },
        attributes: [
          'idProducto',
          [fn('MIN', col('caducidad')), 'caducidad']
        ],
        include: [{
          model: db.Producto,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'presentacion']
        }],
        group: ['Lote.idProducto', 'producto.idProducto']
      });

      const data = rows.map(r => {
        const fecha = r.get('caducidad');
        const dRest = fecha ? diffDays(hoy, new Date(fecha)) : null;
        const vo = new AlertaVO({
          idProducto: r.idProducto,
          producto: r.producto?.nombre || '',
          presentacion: r.producto?.presentacion || '',
          tipo: 'caducar',
          fecha,
          diasRestantes: dRest
        });
        return vo.toResponse();
      });

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

  /**
   * Productos con stock total (SUM(unidadesExistentes)) < umbral (default 10)
   */
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

      const data = rows.map(r => {
        const vo = new AlertaVO({
          idProducto: r.idProducto,
          producto: r.producto?.nombre || '',
          presentacion: r.producto?.presentacion || '',
          tipo: 'bajo',
          cantidad: Number(r.get('stock')) || 0
        });
        return vo.toResponse();
      });

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

  /**
   * Productos con stock total (SUM(unidadesExistentes)) >= umbral (default 100)
   */
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

      const data = rows.map(r => {
        const vo = new AlertaVO({
          idProducto: r.idProducto,
          producto: r.producto?.nombre || '',
          presentacion: r.producto?.presentacion || '',
          tipo: 'alto',
          cantidad: Number(r.get('stock')) || 0
        });
        return vo.toResponse();
      });

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
