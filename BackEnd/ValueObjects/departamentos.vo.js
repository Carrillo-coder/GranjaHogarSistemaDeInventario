class DepartamentosVO {
    constuctor(data) {
        this.ID_Departamento = data.ID_Departamento || null;
        this.nombre = data.nombre || '';
    }
    toResponse() {
        return {
            ID_Departamento: this.ID_Departamento,
            nombre: this.nombre,
        };
    }
}

module.exports = DepartamentosVO;
