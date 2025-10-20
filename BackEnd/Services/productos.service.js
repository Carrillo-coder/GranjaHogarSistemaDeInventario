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
        include: [
          { model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }
        ],
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        message: data.length ? 'Productos obtenidos correctamente' : 'No se encontraron productos',
        data,
        statusCode: 200
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener productos', error: error.message, statusCode: 500 };
    }
  }

  static async getById(id) {
    try {
      const data = await db.Producto.findByPk(id, {
        include: [
          { model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }
        ]
      });

      if (!data) {
        return { success: false, message: 'Producto no encontrado', data: null, statusCode: 404 };
      }

      return { success: true, message: 'Producto obtenido correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener producto', error: error.message, statusCode: 500 };
    }
  }

  static async create(body) {
    try {
      const vo = new ProductoVO(body);
      const val = vo.validate();
      if (!val.isValid)
        return { success: false, message: 'Datos inválidos', errors: val.errors, statusCode: 400 };

      let idCategoria = vo.idCategoria;

      if (!idCategoria && vo.categoriaText) {
        const [cat] = await db.Categoria.findOrCreate({
          where: { nombre: vo.categoriaText },
          defaults: { nombre: vo.categoriaText }
        });
        idCategoria = cat.idCategoria;
      } else if (idCategoria) {
        const exists = await db.Categoria.findByPk(idCategoria);
        if (!exists) return { success: false, message: 'La categoría especificada no existe', statusCode: 400 };
      }

      // Duplicado por (nombre, presentacion)
      const duplicado = await db.Producto.findOne({
        where: { nombre: vo.nombre, presentacion: vo.presentacion }
      });
      if (duplicado) {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }

      const created = await db.Producto.create({
        nombre: vo.nombre,
        presentacion: vo.presentacion,
        idCategoria
      });

      const data = await db.Producto.findByPk(created.idProducto, {
        include: [
          { model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }
        ]
      });

      return { success: true, message: 'Producto creado correctamente', data, statusCode: 201 };
    } catch (error) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return { success: false, message: 'Ya existe un producto con el mismo nombre y presentación', statusCode: 400 };
      }
      return { success: false, message: 'Error al crear producto', error: error.message, statusCode: 500 };
    }
  }

  static async update(id, body) {
    try {
      const prod = await db.Producto.findByPk(id);
      if (!prod) return { success: false, message: 'Producto no encontrado', statusCode: 404 };

      const vo = new ProductoVO(body);
      const val = vo.validate();
      if (!val.isValid)
        return { success: false, message: 'Datos inválidos', errors: val.errors, statusCode: 400 };

      let idCategoria = vo.idCategoria;

      if (!idCategoria && vo.categoriaText) {
        const [cat] = await db.Categoria.findOrCreate({
          where: { nombre: vo.categoriaText },
          defaults: { nombre: vo.categoriaText }
        });
        idCategoria = cat.idCategoria;
      } else if (idCategoria) {
        const exists = await db.Categoria.findByPk(idCategoria);
        if (!exists) return { success: false, message: 'La categoría especificada no existe', statusCode: 400 };
      }

      // Duplicado con otro id
      const dup = await db.Producto.findOne({
        where: {
          idProducto: { [Op.ne]: id },
          nombre: vo.nombre,
          presentacion: vo.presentacion
        }
      });
      if (dup) return { success: false, message: 'Ya existe otro producto con el mismo nombre y presentación', statusCode: 400 };

      await db.Producto.update(
        { nombre: vo.nombre, presentacion: vo.presentacion, idCategoria },
        { where: { idProducto: id } }
      );

      const data = await db.Producto.findByPk(id, {
        include: [
          { model: db.Categoria, as: 'categoria', attributes: ['idCategoria', 'nombre'] }
        ]
      });

      return { success: true, message: 'Producto actualizado correctamente', data, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al actualizar producto', error: error.message, statusCode: 500 };
    }
  }

  static async remove(id) {
    try {
      // No eliminar si hay lotes activos
      const lotes = await db.Lote.count({ where: { idProducto: id, activo: true } });
      if (lotes > 0) {
        return { success: false, message: 'No se puede eliminar: existen lotes activos asociados', statusCode: 400 };
      }

      const rows = await db.Producto.destroy({ where: { idProducto: id } });
      if (!rows) return { success: false, message: 'Producto no encontrado', statusCode: 404 };

      return { success: true, message: 'Producto eliminado correctamente', statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al eliminar producto', error: error.message, statusCode: 500 };
    }
  }

  static async getCantidadTotal(idProducto) {
    try {
      const lotes = await db.Lote.findAll({
        where: { idProducto, activo: true },
        attributes: ['unidadesExistentes']
      });

      const total = lotes.reduce((sum, l) => sum + (l.unidadesExistentes || 0), 0);

      return {
        success: true,
        message: lotes.length ? 'Cantidad total calculada correctamente' : 'No hay lotes activos para este producto',
        data: { idProducto, cantidadTotal: total },
        statusCode: 200
      };
    } catch (error) {
      return { success: false, message: 'Error al calcular cantidad total', error: error.message, statusCode: 500 };
    }
  }

  static async getCaducidadMasProxima(idProducto) {
    try {
      const lote = await db.Lote.findOne({
        where: { idProducto, activo: true },
        order: [['caducidad', 'ASC']]
      });

      if (!lote) {
        return { success: true, message: 'No hay lotes activos para este producto', data: { idProducto, caducidad: null }, statusCode: 200 };
      }

      return { success: true, message: 'Fecha de caducidad más próxima obtenida correctamente', data: { idProducto, caducidad: lote.caducidad }, statusCode: 200 };
    } catch (error) {
      return { success: false, message: 'Error al obtener caducidad más próxima', error: error.message, statusCode: 500 };
    }
  }
}

module.exports = ProductosService;
