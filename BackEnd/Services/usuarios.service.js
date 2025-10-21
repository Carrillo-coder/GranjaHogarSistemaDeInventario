const db = require('../Models');
const UsuarioVO = require('../ValueObjects/usuarios.vo');
const bcrypt = require('bcrypt');

const Usuario = db.Usuario;
const Rol = db.Rol;
class UsuarioService {

    static async getAllUsuarios() {
        try {
            const usuarios = await Usuario.findAll({
                where: { activo: true },
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }],
                order: [['nombreCompleto', 'ASC']]
            });
            
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

    static async getUsuarioById(id) {
        try {
            const usuario = await Usuario.findByPk(id, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }]
            });

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

    static async getUsuarioByUserName(UserName) {
        try {
            const usuario = await Usuario.findOne({
                where: { nombreUsuario: UserName, activo: true },
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }]
            });

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

    static async createUsuario(data) {
        try {
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

            const rolExists = await Rol.findByPk(data.idRol);
            if (!rolExists) {
                return {
                    success: false,
                    message: 'El rol especificado no existe',
                    statusCode: 400
                };
            }

            const existingUser = await Usuario.findOne({
                where: { nombreUsuario: data.nombreUsuario }
            });
            
            if (existingUser) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso',
                    statusCode: 400
                };
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            usuarioVO.password = hashedPassword;

            const nuevoUsuario = await Usuario.create(usuarioVO.toDatabase());

            const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.idUsuario, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }]
            });

            return {
                success: true,
                message: 'Usuario creado correctamente',
                data: usuarioCompleto,
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

    static async updateUsuario(id, data) {
        try {
            const usuarioExiste = await Usuario.findByPk(id);
            if (!usuarioExiste) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    statusCode: 204
                };
            }

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

            const rolExists = await Rol.findByPk(data.idRol);
            if (!rolExists) {
                return {
                    success: false,
                    message: 'El rol especificado no existe',
                    statusCode: 400
                };
            }

            const existingUser = await Usuario.findOne({
                where: { 
                    nombreUsuario: data.nombreUsuario,
                    idUsuario: { [db.Sequelize.Op.ne]: id }
                }
            });
            
            if (existingUser) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso',
                    statusCode: 400
                };
            }

            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                usuarioVO.password = hashedPassword;
            } else {
                usuarioVO.password = usuarioExiste.password;
            }

            await Usuario.update(usuarioVO.toDatabase(), {
                where: { idUsuario: id }
            });

            const usuarioActualizado = await Usuario.findByPk(id, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }]
            });

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

    static async deleteUsuario(id) {
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    statusCode: 204
                };
            }

            await Usuario.update(
                { activo: false },
                { where: { idUsuario: id } }
            );

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