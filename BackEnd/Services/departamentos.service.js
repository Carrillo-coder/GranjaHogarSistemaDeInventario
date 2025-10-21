const db = require('../Models');
const Departamento = db.Departamento;

class DepartamentosService {
    static async getAllDepartamentos() {
        try {
            const departamentos = await Departamento.findAll();
            if (!departamentos || departamentos.length === 0) {
                return {
                    success: false,
                    message: 'No se encontraron departamentos',
                    data: [],
                    statusCode: 204
                };
            }
            return {
                success: true,
                message: 'Departamentos obtenidos correctamente',
                data: departamentos,
                statusCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener departamentos',
                error: error.message,
                statusCode: 400
            };
        }
    }
};

module.exports = DepartamentosService;
