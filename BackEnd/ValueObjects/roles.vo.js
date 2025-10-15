class RolVO {
    constructor(data) {
        this.ID_Rol = data.ID_Rol || null;
        this.nombre = data.nombre || '';
    }

    toResponse() {
        return {
            ID_Rol: this.ID_Rol,
            nombre: this.nombre
        };
    }
}

module.exports = RolVO;