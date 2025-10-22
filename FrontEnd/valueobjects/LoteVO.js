// valueobjects/LoteVO.js
export class LoteVO {
  constructor({
    idLote = null,
    cantidad = null,
    caducidad = null, // expected format: YYYY-MM-DD or Date instance
    idProducto = null,
    nombre = null,
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
      nombre: obj.nombre ?? obj.nombreProducto ?? (obj.producto && obj.producto.nombre) ?? null,
    });
  }

  static _normalizeDate(value) {
    if (!value && value !== 0) return null;

    // If it's already a Date instance
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    }

    // If it's a string, support DD-MM-YYYY and YYYY-MM-DD
    if (typeof value === 'string') {
      const ddmmyyyy = /^\s*(\d{2})-(\d{2})-(\d{4})\s*$/;
      const yyyymmdd = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/;
      let m;
      if ((m = value.match(ddmmyyyy))) {
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10);
        const year = parseInt(m[3], 10);
        const dateObj = new Date(year, month - 1, day);
        if (!isNaN(dateObj.getTime())) return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      } else if ((m = value.match(yyyymmdd))) {
        const year = parseInt(m[1], 10);
        const month = parseInt(m[2], 10);
        const day = parseInt(m[3], 10);
        const dateObj = new Date(year, month - 1, day);
        if (!isNaN(dateObj.getTime())) return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      } else {
        // Try generic Date parsing as a fallback
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          const year = parsed.getFullYear();
          const month = String(parsed.getMonth() + 1).padStart(2, '0');
          const day = String(parsed.getDate()).padStart(2, '0');
          return `${day}-${month}-${year}`;
        }
      }
    }

    // If it's numeric (timestamp)
    if (typeof value === 'number') {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
      }
    }

    return null;
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
