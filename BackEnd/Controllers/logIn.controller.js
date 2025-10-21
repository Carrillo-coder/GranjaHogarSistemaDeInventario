const LoginService = require('../Services/logIn.service');
/**
 * LogInController
 * @description Controlador para manejar las solicitudes de inicio de sesión.
 * @param {Request} req - Usuario a verificar.
 * @param {Response} res - Respuesta con el resultado del inicio de sesión.
 */

class LogInController {
    async handleLogIn(req, res) {
        try {
            const { username } = req.params;
            const { password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre de usuario y contraseña son requeridos'
                });
            }

            const {usuario, token} = await LoginService.logIn(username, password);

            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                data: {
                    id: usuario.idUsuario,
                    nombreUsuario: usuario.nombreUsuario,
                    rol: usuario.rol.nombre
                }
            });

        } catch (error) {
            console.error('Error en el controlador de inicio de sesión:', error);
            if (error.message.includes('Usuario no encontrado') || error.message.includes('Contraseña incorrecta')) {
                return res.status(401).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = LogInController;