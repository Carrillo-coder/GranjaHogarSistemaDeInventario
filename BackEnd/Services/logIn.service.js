const usuariosService = require('../Services/usuarios.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginService {
    static async logIn(nombreUsuario, password) {
        try {
            const usuario = await usuariosService.getUsuarioByUserName(nombreUsuario);
            if (!usuario.success || !usuario.data) {
                throw new Error('Usuario no encontrado o inactivo');
            }

            const passwordMatch = await bcrypt.compare(password, usuario.data.password);
            if (!passwordMatch) {
                throw new Error('Contraseña incorrecta');
            }
            const token = jwt.sign({ id: usuario.data.idUsuario, rol: usuario.data.rol.nombre }, 'your_jwt_secret', { expiresIn: '72h' });
            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                data: {
                    token, usuario: {
                        idUsuario: usuario.data.idUsuario,
                        nombreUsuario: usuario.data.nombreUsuario,
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