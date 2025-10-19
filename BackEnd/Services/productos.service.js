const db = require('../Models');
const { Op } = db.Sequelize;
const ProductoVO = require('../ValueObjects/productos.vo');

class ProductosService {
  static async getAll({ nombre, presentacion }) {
    try {
      const where = {};
      if (nombre)       where.nombre       = { [Op.like]: `%${nombre}%` };
      if (presentacion) where.presentacion = { [Op.like]: `%${presentacion}%` };

      const data = await db.Producto.findAll({
        where,
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }],
        order: [['nombre', 'ASC']]
      });

      if (!data.length) {
        return { success: false, message: 'No se encontraron productos', data: [], statusCode: 204 };
      }

      return { success: true, message: 'Productos obtenidos correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos', error: error.message, statusCode: 400 };
    }
  }

  static async getById(id) {
    try {
      const data = await db.Producto.findByPk(id, {
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }]
      });
      if (!data) {
        return { success: false, message: 'Producto no encontrado', data: null, statusCode: 204 };
      }
      return { success: true, message: 'Producto obtenido correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener producto', error: error.message, statusCode: 400 };
    }
  }

  static async create(body) {
    try {
      const vo = new ProductoVO(body);
      const val = vo.validate();
      if (!val.isValid) {
        return { success: false, message: 'Datos inválidos', errors: val.errors, statusCode: 400 };
      }

      const [cat] = await db.Categoria.findOrCreate({
        where: { nombre: vo.categoria }
      });

      const exists = await db.Producto.findOne({
        where: { nombre: vo.nombre, presentacion: vo.presentacion }
      });
      if (exists) {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }

      const created = await db.Producto.create({
        nombre: vo.nombre,
        presentacion: vo.presentacion,
        idCategoria: cat.idCategoria
      });

      const data = await db.Producto.findByPk(created.idProducto, {
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }]
      });

      return { success: true, message: 'Producto creado correctamente (ID autoincremental)', data, statusCode: 201 };
    } catch (error) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }
      return { success: false, message: 'Error al crear producto', error: error.message, statusCode: 400 };
    }
  }
}

module.exports = ProductosService;
