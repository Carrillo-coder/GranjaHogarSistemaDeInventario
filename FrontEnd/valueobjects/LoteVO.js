// valueobjects/LoteVO.js

export class LoteVO {
  constructor({
    idLote = null,
    cantidad = null,
    caducidad = null, // expected format: YYYY-MM-DD or Date instance
    idProducto = null,
    nombre = '',
  } = {}) {
    this.idLote = idLote;
    this.cantidad = cantidad;
    this.caducidad = LoteVO._normalizeDate(caducidad);
    this.idProducto = idProducto;
    this.nombre = nombre;
  }

  static fromApi(obj = {}) {
    return new LoteVO({
      idLote: obj.idLote ?? obj.id ?? null,
      cantidad: obj.cantidad ?? null,
      caducidad: LoteVO._normalizeDate(obj.caducidad ?? obj.fechaCaducidad ?? null),
      idProducto: obj.idProducto ?? obj.productoId ?? null,
      nombre: obj.nombre ?? obj.producto ?? '',
    });
  }

  static _normalizeDate(value) {
    if (!value && value !== 0) return null;
    let dateObj = null;
    if (value instanceof Date) {
      dateObj = value;
    } else if (typeof value === 'string') {
      // Detect DD-MM-YYYY format
      const ddmmyyyy = value.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
      if (ddmmyyyy) {
        // JS Date: month is 0-based
        const day = parseInt(ddmmyyyy[1], 10);
        const month = parseInt(ddmmyyyy[2], 10) - 1;
        const year = parseInt(ddmmyyyy[3], 10);
        dateObj = new Date(year, month, day);
      } else {
        // Try to parse other formats
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }
    } else if (typeof value === 'number') {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }

    if (!dateObj) return null;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  toApi() {
    return {
      idLote: this.idLote,
      cantidad: this.cantidad,
      caducidad: this.caducidad,
      idProducto: this.idProducto,
      nombre: this.nombre,
    };
  }
}
