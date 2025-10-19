class DepartamentosVO {
    constructor(data) {
        this.idDepartamento = data.idDepartamento || null;
        this.nombre = data.nombre || '';
    }
    toResponse() {
        return {
            idDepartamento: this.idDepartamento,
            nombre: this.nombre,
        };
    }
}

module.exports = DepartamentosVO;
