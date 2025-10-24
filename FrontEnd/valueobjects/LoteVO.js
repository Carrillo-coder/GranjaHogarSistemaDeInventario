export class LoteVO {
  constructor({ idLote = null, idProducto = null, nombre = null, nombreProducto = null, cantidad = null, caducidad = null, ...rest } = {}) {
    this.idLote = idLote;
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.nombreProducto = nombreProducto;
    this.cantidad = cantidad;
    this.caducidad = caducidad;
    Object.assign(this, rest);
  }

  toApi() {
    // Return the shape expected by the backend when creating a lote
    return {
      idLote: this.idLote,
      idProducto: this.idProducto,
      nombre: this.nombre ?? this.nombreProducto,
      cantidad: this.cantidad,
      caducidad: this.caducidad,
      // include other fields if present
    };
  }
}
