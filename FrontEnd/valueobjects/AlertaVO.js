// valueobjects/AlertaVO.js
export class AlertaVO {
  constructor({
    idProducto = null,
    producto = '',
    presentacion = '',
    tipo = '',            // 'caducar' | 'bajo' | 'alto'
    cantidad = null,      // para bajo/alto
    fechaCaducidad = null,// para caducar (YYYY-MM-DD)
    diasRestantes = null  // para caducar
  } = {}) {
    this.idProducto = idProducto;
    this.producto = producto;
    this.presentacion = presentacion;
    this.tipo = tipo;
    this.cantidad = cantidad;
    this.fechaCaducidad = fechaCaducidad;
    this.diasRestantes = diasRestantes;
  }

  static fromApi(obj = {}) {
    return new AlertaVO({
      idProducto: obj.idProducto ?? null,
      producto: obj.producto ?? '',
      presentacion: obj.presentacion ?? '',
      tipo: obj.tipo ?? '',
      cantidad: obj.cantidad ?? null,
      fechaCaducidad: obj.fechaCaducidad ?? null,
      diasRestantes: obj.diasRestantes ?? null,
    });
  }
}
