const DepartamentosModel = require('../Models/departamentos.model');

exports.getAllDepartamentos = async () => {
    try {
        const departamentos = await DepartamentosModel.findAll();
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
};

module.exports = {
    getAllDepartamentos: exports.getAllDepartamentos,
};
