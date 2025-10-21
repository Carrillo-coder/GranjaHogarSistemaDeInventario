const LoginService = require('../Services/logIn.service');
/**
 * LogInController
 * @description Controlador para manejar las solicitudes de inicio de sesión.
 * @param {Request} req - Usuario a verificar.
 * @param {Response} res - Respuesta con el resultado del inicio de sesión.
 */

class LogInController {
    static async handleLogIn(req, res) {
        try {
            const { username } = req.params;
            const { password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre de usuario y contraseña son requeridos'
                });
            }

            const result = await LoginService.logIn(username, password);

            if (!result.success) {
                return res.status(result.statusCode).json({
                    success: false,
                    message: result.message
                });
            }
            const { usuario, token } = result.data;


            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                data: {
                    id: usuario.idUsuario,
                    nombreUsuario: usuario.nombreUsuario,
                    rol: usuario.rol
                }
            });

        } catch (error) {
            console.error('Error en el controlador de inicio de sesión:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = LogInController;