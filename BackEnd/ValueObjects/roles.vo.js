class RolVO {
    constructor(data) {
        this.idRol = data.idRol || null;
        this.nombre = data.nombre || '';
    }

    toResponse() {
        return {
            idRol: this.idRol,
            nombre: this.nombre
        };
    }
}

module.exports = RolVO;