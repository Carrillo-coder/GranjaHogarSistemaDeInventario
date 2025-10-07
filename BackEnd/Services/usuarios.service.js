const UsuarioModel = require('../Models/usuarios.model');
const RolModel = require('../Models/roles.model');
const UsuarioVO = require('../ValueObjects/usuarios.vo');
const bcrypt = require('bcrypt');

/**
 * Servicio de Usuario
 * Contiene la lógica de negocio para usuarios
 */
class UsuarioService {

    /**
     * Obtener todos los usuarios
     */
    static async getAllUsuarios() {
        try {
            const usuarios = await UsuarioModel.findAll();
            
            if (!usuarios || usuarios.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron usuarios',
                    data: [],
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: usuarios,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener usuarios',
                error: error.message,
                statusCode: 400
            };
        }
    }

    /**
     * Obtener usuario por ID
     */
    static async getUsuarioById(id) {
        try {
            const usuario = await UsuarioModel.findById(id);

            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    data: null,
                    statusCode: 204
                };
            }

            return {
                success: true,
                message: 'Usuario obtenido correctamente',
                data: usuario,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener usuario',
                error: error.message,
                statusCode: 400
            };
        }
    }

    /**
     * Crear nuevo usuario
     */
    static async createUsuario(data) {
        try {
            // Crear VO y validar
            const usuarioVO = new UsuarioVO(data);
            const validation = usuarioVO.validate();

            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Datos inválidos',
                    errors: validation.errors,
                    statusCode: 400
                };
            }

            // Verificar si el rol existe
            const rolExists = await RolModel.exists(data.ID_Rol);
            if (!rolExists) {
                return {
                    success: false,
                    message: 'El rol especificado no existe',
                    statusCode: 400
                };
            }

            // Verificar si el nombre de usuario ya existe
            const usernameExists = await UsuarioModel.existsByUsername(data.nombreUsuario);
            if (usernameExists) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso',
                    statusCode: 400
                };
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(data.password, 10);
            usuarioVO.password = hashedPassword;

            // Crear usuario
            const usuarioId = await UsuarioModel.create(usuarioVO.toDatabase());

            // Obtener usuario creado
            const nuevoUsuario = await UsuarioModel.findById(usuarioId);

            return {
                success: true,
                message: 'Usuario creado correctamente',
                data: nuevoUsuario,
                statusCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear usuario',
                error: error.message,
                statusCode: 400
            };
        }
    }

    /**
     * Actualizar usuario existente
     */
    static async updateUsuario(id, data) {
        try {
            // Verificar si el usuario existe
            const usuarioExiste = await UsuarioModel.findById(id);
            if (!usuarioExiste) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    statusCode: 204
                };
            }

            // Crear VO y validar
            const usuarioVO = new UsuarioVO(data);
            const validation = usuarioVO.validate();

            if (!validation.isValid) {
                return {
                    success: false,
                    message: 'Datos inválidos',
                    errors: validation.errors,
                    statusCode: 400
                };
            }

            // Verificar si el rol existe
            const rolExists = await RolModel.exists(data.ID_Rol);
            if (!rolExists) {
                return {
                    success: false,
                    message: 'El rol especificado no existe',
                    statusCode: 400
                };
            }

            // Verificar si el nombre de usuario ya existe (excluyendo el actual)
            const usernameExists = await UsuarioModel.existsByUsername(data.nombreUsuario, id);
            if (usernameExists) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso',
                    statusCode: 400
                };
            }

            // Encriptar contraseña si se proporciona
            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                usuarioVO.password = hashedPassword;
            } else {
                // Si no se proporciona contraseña, mantener la actual
                usuarioVO.password = usuarioExiste.password;
            }

            // Actualizar usuario
            await UsuarioModel.update(id, usuarioVO.toDatabase());

            // Obtener usuario actualizado
            const usuarioActualizado = await UsuarioModel.findById(id);

            return {
                success: true,
                message: 'Usuario actualizado correctamente',
                data: usuarioActualizado,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar usuario',
                error: error.message,
                statusCode: 400
            };
        }
    }

    /**
     * Desactivar usuario (soft delete)
     */
    static async deleteUsuario(id) {
        try {
            // Verificar si el usuario existe
            const usuario = await UsuarioModel.findById(id);
            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    statusCode: 204
                };
            }

            // Desactivar usuario
            await UsuarioModel.deactivate(id);

            return {
                success: true,
                message: 'Usuario desactivado correctamente',
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al desactivar usuario',
                error: error.message,
                statusCode: 400
            };
        }
    }
}

module.exports = UsuarioService; 