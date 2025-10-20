// ValueObjects/alertas.vo.js
class AlertaVO {
  /**
   * @param {object} data
   * @param {number} data.idProducto
   * @param {string} data.producto
   * @param {string} data.presentacion
   * @param {('caducar'|'bajo'|'alto')} data.tipo
   * @param {number|null} [data.cantidad]         // para 'bajo' y 'alto'
   * @param {string|Date|null} [data.fecha]       // para 'caducar'
   * @param {number|null} [data.diasRestantes]    // calculado para 'caducar'
   */
  constructor(data = {}) {
    this.idProducto = data.idProducto ?? null;
    this.producto = data.producto ?? '';
    this.presentacion = data.presentacion ?? '';
    this.tipo = data.tipo ?? '';

    // métricas según tipo
    this.cantidad = data.cantidad ?? null;
    this.fechaCaducidad = data.fecha ? (typeof data.fecha === 'string' ? data.fecha : data.fecha?.toISOString?.().slice(0,10)) : null;
    this.diasRestantes = data.diasRestantes ?? null;
  }

  toResponse() {
    return {
      idProducto: this.idProducto,
      producto: this.producto,
      presentacion: this.presentacion,
      tipo: this.tipo,
      cantidad: this.cantidad,              // puede ser null en 'caducar'
      fechaCaducidad: this.fechaCaducidad,  // puede ser null en 'bajo'/'alto'
      diasRestantes: this.diasRestantes     // solo en 'caducar'
    };
  }
}

module.exports = AlertaVO;
