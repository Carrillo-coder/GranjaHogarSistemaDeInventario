const ProductoService = require('../Services/producto.service');

class ProductoController {

    // GET /api/inventario/productos
    static async getAll(req, res) {
        try {
            const result = await ProductoService.getAllProductos();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/inventario/productos/:id
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductoService.getProductoById(id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/inventario/productos?categoria=idCategoria
    static async getByCategoria(req, res) {
        try {
            const { categoria } = req.query;
            const result = await ProductoService.getProductosByCategoria(categoria);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/inventario/productos/:id/cantidad
    static async getCantidad(req, res) {
    try {
        const { id } = req.params;
        const result = await ProductoService.getCantidadTotal(id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
    }

    // GET /api/inventario/productos/:id/caducidad
    static async getCaducidad(req, res) {
    try {
        const { id } = req.params;
        const result = await ProductoService.getCaducidadMasProxima(id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
    }

    // POST /api/inventario/productos
    static async create(req, res) {
        try {
            const result = await ProductoService.createProducto(req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT /api/inventario/productos/:id
    static async update(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductoService.updateProducto(id, req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE /api/inventario/productos/:id
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductoService.deleteProducto(id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = ProductoController;
