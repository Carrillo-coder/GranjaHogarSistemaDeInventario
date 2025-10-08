class tipoSalidaVO {
    constructor(data) {
        this.idTipoS = data.idTipoS || null;
        this.Nombre = data.Nombre || '';
    }

    toResponse() {
        return {
            idTipoS: this.idTipoS,
            N0ombre: this.Nombre
        };
    }
}

module.exports = tipoSalidaVO;