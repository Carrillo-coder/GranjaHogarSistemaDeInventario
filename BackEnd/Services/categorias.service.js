const db = require('../Models');
const Categoria = db.Categoria; // ✅ singular, coincide con tu index.js
const CategoriasVO = require('../ValueObjects/categorias.vo');

class CategoriasService {
  static async getAllCategorias() {
    try {
      const categorias = await Categoria.findAll();
      return {
        success: true,
        message: categorias.length
          ? 'Categorías obtenidas correctamente'
          : 'No hay categorías disponibles',
        data: categorias.map(c => new CategoriasVO(c)),
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener categorías',
        error: error.message,
        statusCode: 500
      };
    }
  }

  static async getCategoriaById(id) {
    try {
      const categoria = await Categoria.findOne({ where: { idCategoria: id } });
      if (!categoria) {
        return {
          success: false,
          message: 'Categoría no encontrada',
          data: null,
          statusCode: 404
        };
      }
      return {
        success: true,
        message: 'Categoría obtenida correctamente',
        data: new CategoriasVO(categoria),
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener categoría',
        error: error.message,
        statusCode: 500
      };
    }
  }

  static async getCategoriaByNombre(nombre) {
    try {
      const categoria = await Categoria.findOne({ where: { nombre } });
      if (!categoria) {
        return {
          success: false,
          message: 'Categoría no encontrada',
          data: null,
          statusCode: 404
        };
      }
      return {
        success: true,
        message: 'Categoría obtenida correctamente',
        data: new CategoriasVO(categoria),
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener categoría',
        error: error.message,
        statusCode: 500
      };
    }
  }
}

module.exports = CategoriasService;
