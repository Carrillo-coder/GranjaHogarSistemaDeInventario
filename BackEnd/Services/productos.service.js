const db = require('../Models');
const { Op } = db.Sequelize;
const ProductoVO = require('../ValueObjects/productos.vo');

class ProductosService {

  static async getAll({ nombre, presentacion }) {
    try {
      const where = {};
      if (nombre)       where.Nombre       = { [Op.like]: `%${nombre}%` };
      if (presentacion) where.Presentacion = { [Op.like]: `%${presentacion}%` };

      const data = await db.Producto.findAll({
        where,
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'Nombre'] }],
        order: [['Nombre', 'ASC']]
      });

      if (!data.length) return { success: false, message: 'No se encontraron productos', data: [], statusCode: 204 };
      return { success: true, message: 'Productos obtenidos correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos', error: error.message, statusCode: 400 };
    }
  }

  static async getById(id) {
    try {
      const data = await db.Producto.findByPk(id, {
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'Nombre'] }]
      });
      if (!data) return { success: false, message: 'Producto no encontrado', data: null, statusCode: 204 };
      return { success: true, message: 'Producto obtenido correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener producto', error: error.message, statusCode: 400 };
    }
  }

  static async create(body) {
    try {
      const vo = new ProductoVO(body);
      const val = vo.validate();
      if (!val.isValid) return { success: false, message: 'Datos inválidos', errors: val.errors, statusCode: 400 };

      let idCategoria = vo.idCategoria;
      if (!idCategoria && vo.categoriaText) {
        const [cat] = await db.Categoria.findOrCreate({
          where: { Nombre: vo.categoriaText },
          defaults: { Nombre: vo.categoriaText }
        });
        idCategoria = cat.idCategoria;
      } else if (idCategoria) {
        const exists = await db.Categoria.findByPk(idCategoria);
        if (!exists) return { success: false, message: 'La categoría especificada no existe', statusCode: 400 };
      }

      const duplicado = await db.Producto.findOne({
        where: { Nombre: vo.nombre, Presentacion: vo.presentacion }
      });
      if (duplicado) {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }

      const created = await db.Producto.create({
        Nombre: vo.nombre,
        Presentacion: vo.presentacion,
        idCategoria
      });

      const data = await db.Producto.findByPk(created.idProducto, {
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'Nombre'] }]
      });

      return { success: true, message: 'Producto creado correctamente (ID autoincremental)', data, statusCode: 201 };
    } catch (error) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }
      return { success: false, message: 'Error al crear producto', error: error.message, statusCode: 400 };
    }
  }

  static async update(id, body) {
    try {
      const prod = await db.Producto.findByPk(id);
      if (!prod) return { success: false, message: 'Producto no encontrado', statusCode: 204 };

      const vo = new ProductoVO(body);
      const val = vo.validate();
      if (!val.isValid) return { success: false, message: 'Datos inválidos', errors: val.errors, statusCode: 400 };

      let idCategoria = vo.idCategoria;
      if (!idCategoria && vo.categoriaText) {
        const [cat] = await db.Categoria.findOrCreate({
          where: { Nombre: vo.categoriaText },
          defaults: { Nombre: vo.categoriaText }
        });
        idCategoria = cat.idCategoria;
      } else if (idCategoria) {
        const exists = await db.Categoria.findByPk(idCategoria);
        if (!exists) return { success: false, message: 'La categoría especificada no existe', statusCode: 400 };
      }

      const dup = await db.Producto.findOne({
        where: {
          idProducto: { [Op.ne]: id },
          Nombre: vo.nombre,
          Presentacion: vo.presentacion
        }
      });
      if (dup) return { success: false, message: 'Ya existe otro producto con el mismo nombre y presentación', statusCode: 400 };

      await db.Producto.update(
        { Nombre: vo.nombre, Presentacion: vo.presentacion, idCategoria },
        { where: { idProducto: id } }
      );

      const data = await db.Producto.findByPk(id, {
        include: [{ model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'Nombre'] }]
      });

      return { success: true, message: 'Producto actualizado correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al actualizar producto', error: error.message, statusCode: 400 };
    }
  }

  static async remove(id) {
    try {
      const lotes = await db.Lote.count({ where: { idProducto: id, Activo: 1 } });
      if (lotes > 0) {
        return { success: false, message: 'No se puede eliminar: existen lotes activos asociados', statusCode: 400 };
      }

      const rows = await db.Producto.destroy({ where: { idProducto: id } });
      if (!rows) return { success: false, message: 'Producto no encontrado', statusCode: 204 };

      return { success: true, message: 'Producto eliminado correctamente', statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al eliminar producto', error: error.message, statusCode: 400 };
    }
  }

  static async getCantidadTotal(idProducto) {
    try {
      const lotes = await db.Lote.findAll({
        where: { idProducto, Activo: 1 },
        attributes: ['unidadesExistentes']
      });

      if (!lotes || lotes.length === 0) {
        return { success: false, message: 'No hay lotes activos para este producto', data: 0, statusCode: 204 };
      }

      const total = lotes.reduce((sum, l) => sum + (l.unidadesExistentes || 0), 0);
      return { success: true, message: 'Cantidad total calculada correctamente', data: { idProducto, cantidadTotal: total }, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al calcular cantidad total', error: error.message, statusCode: 400 };
    }
  }

  static async getCaducidadMasProxima(idProducto) {
    try {
      const lote = await db.Lote.findOne({
        where: { idProducto, Activo: 1 },
        order: [['Caducidad', 'ASC']]
      });

      if (!lote) return { success: false, message: 'No hay lotes activos para este producto', data: null, statusCode: 204 };
      return { success: true, message: 'Fecha de caducidad más próxima obtenida correctamente', data: { idProducto, caducidad: lote.Caducidad }, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener caducidad más próxima', error: error.message, statusCode: 400 };
    }
  }
}

module.exports = ProductosService;