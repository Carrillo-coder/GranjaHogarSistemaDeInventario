class ReportesVO {
    constructor(data){
        this.fechaInicio = data.fechaInicio || null;
        this.fechaFin = data.fechaFin || null;
        this.formato = data.formato || '';
    }

    validate() {
        const errors = [];
        if (!this.fechaInicio || this.fechaInicio.trim() === '') {
            errors.push('La fecha de inicio es obligatoria');
        } else if (!Date.parse(this.fechaInicio)) {
            errors.push('La fecha de inicio no es válida');
        }
        if (!this.fechaFin || this.fechaFin.trim() === '') {
            errors.push('La fecha de fin es obligatoria');
        } else if (!Date.parse(this.fechaFin)) {
            errors.push('La fecha de fin no es válida');
        }
        if (this.fechaInicio > this.fechaFin) {
            errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
        }
        if (!this.formato || this.formato.trim() === '') {
            errors.push('El formato es obligatorio');
        } else if (!['XLSX', 'PDF'].includes(this.formato)) {
            errors.push('El formato debe ser XLSX o PDF');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }

}

module.exports = ReportesVO;
