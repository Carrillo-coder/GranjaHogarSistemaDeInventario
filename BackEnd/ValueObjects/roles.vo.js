/**
 * Value Object para Rol
 * Define la estructura de un rol
 */
class RolVO {
    constructor(data) {
        this.ID_Rol = data.ID_Rol || null;
        this.nombre = data.nombre || '';
    }

    // Convertir a objeto para respuesta
    toResponse() {
        return {
            ID_Rol: this.ID_Rol,
            nombre: this.nombre
        };
    }
}

module.exports = RolVO;