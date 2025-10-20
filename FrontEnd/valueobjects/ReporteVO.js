/**
 * Reporte submission value object
 * @constructor
 * @param {string} fechaInicio - Start date of the report
 * @param {string} fechaFin - End date of the report
 * @param {string} formato - Format of the report (PDF or XLSX)
 */

export const ReporteVO = function (fechaInicio, fechaFin, formato) {
  this.fechaInicio = fechaInicio;
  this.fechaFin = fechaFin;
  this.formato = formato;

  this.validate = function () {
    const errors = [];
    if (!this.fechaInicio) errors.push('La fecha de inicio es obligatoria');
    if (!this.fechaFin) errors.push('La fecha de fin es obligatoria');
    if (new Date(this.fechaInicio) > new Date(this.fechaFin)) {
      errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
    }
    if (!['PDF', 'XLSX'].includes(this.formato)) {
      errors.push('Formato inválido');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  };
};
