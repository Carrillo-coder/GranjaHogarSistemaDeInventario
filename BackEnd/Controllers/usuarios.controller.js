const nodemon = require('nodemon');
const UsuarioService = require('../Services/usuarios.service');

class UsuarioController {

    static async getAll(req, res) {
        try {
            const result = await UsuarioService.getAllUsuarios();
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await UsuarioService.getUsuarioById(id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async getByNombreUsuario(req, res) {
        try {
            const { NombreUsuario } = req.params;
            const result = await UsuarioService.getUsuarioByNombreUsuario(NombreUsuario);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const result = await UsuarioService.createUsuario(req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const result = await UsuarioService.updateUsuario(id, req.body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await UsuarioService.deleteUsuario(id);
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

module.exports = UsuarioController;


