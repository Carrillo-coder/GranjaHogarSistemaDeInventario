// valueobjects/LoteVO.js

/**
 * Value Object que representa un lote dentro del sistema de inventario.
 * Permite estructurar de forma uniforme los datos que se envían al backend.
 */
export class LoteVO {
  /**
   * @param {Object} data - Datos del lote.
   * @param {number|null} data.idLote - ID del lote (opcional antes de crearse).
   * @param {number|null} data.idProducto - ID del producto asociado.
   * @param {string} data.nombreProducto - Nombre del producto asociado.
   * @param {number} data.cantidad - Cantidad de unidades en el lote.
   * @param {string} data.caducidad - Fecha de caducidad en formato YYYY-MM-DD.
   * @param {string} [data.nombre] - Nombre alternativo del lote (opcional).
   */
  constructor({ idLote = null, idProducto = null, nombreProducto = '', cantidad = 0, caducidad = '', nombre = '' }) {
    this.idLote = idLote;
    this.idProducto = idProducto;
    this.nombreProducto = nombreProducto;
    this.cantidad = cantidad;
    this.caducidad = caducidad;
    this.nombre = nombre || nombreProducto;
  }

  /**
   * Convierte el objeto a un formato JSON limpio para enviar al backend.
   */
  toJSON() {
    return {
      idLote: this.idLote,
      idProducto: this.idProducto,
      nombreProducto: this.nombreProducto,
      cantidad: this.cantidad,
      caducidad: this.caducidad,
    };
  }
}
