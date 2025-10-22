// valueobjects/LoteVO.js
export class LoteVO {
  constructor({
    idLote = null,
    cantidad = null,
    caducidad = null, // expected format: YYYY-MM-DD or Date instance
    idProducto = null,
  } = {}) {
    this.idLote = idLote;
    this.cantidad = cantidad;
    this.caducidad = LoteVO._normalizeDate(caducidad);
    this.idProducto = idProducto;
  }

  static fromApi(obj = {}) {
    return new LoteVO({
      idLote: obj.idLote ?? obj.id ?? null,
      cantidad: obj.cantidad ?? null,
      caducidad: LoteVO._normalizeDate(obj.caducidad ?? obj.fechaCaducidad ?? null),
      idProducto: obj.idProducto ?? obj.productoId ?? null,
    });
  }

  static _normalizeDate(value) {
    if (!value && value !== 0) return null;
    // If it's a Date instance
    let dateObj = null;
    if (value instanceof Date) {
      dateObj = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      // Try to parse string/number to Date
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }

    if (!dateObj) return null;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    // Return in DD-MM-YYYY as requested
    return `${day}-${month}-${year}`;
  }

  toApi() {
    return {
      idLote: this.idLote,
      cantidad: this.cantidad,
      caducidad: this.caducidad,
      idProducto: this.idProducto,
    };
  }
}
