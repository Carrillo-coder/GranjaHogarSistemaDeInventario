const usuariosService = require('../Services/usuarios.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginService {
    static async logIn(nombreUsuario, password) {
        try {
            const usuario = await usuariosService.getUsuarioByUserName(nombreUsuario);
            if (!usuario.success || !usuario.data) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    statusCode: 404
                };
            }

            const passwordMatch = await bcrypt.compare(password, usuario.data.password);
            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Contraseña incorrecta',
                    statusCode: 404
                };
            }
            const token = jwt.sign({ id: usuario.data.idUsuario, rol: usuario.data.rol.nombre }, process.env.JWT_SECRET, { expiresIn: '72h' });
            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                data: {
                    token, usuario: {
                        idUsuario: usuario.data.idUsuario,
                        nombreUsuario: usuario.data.nombreUsuario,
                        nombreCompleto: usuario.data.nombreCompleto,
                        rol: usuario.data.rol.nombre
                    }
                },
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al iniciar sesión',
                error: error.message,
                statusCode: 400
            };
        }
    } 
}

module.exports = LoginService;         