class SalidaVO {
  constructor(data = {}) {
    this.idSalida = data.idSalida ?? null;
    this.idTipo = data.idTipo ?? null;
    this.idProducto = data.idProducto ?? null;
    this.idDepartamento = data.idDepartamento ?? null;
    this.cantidad = data.cantidad ?? 0;
    this.idUsuario = data.idUsuario ?? null;
    this.fecha = data.fecha ?? null;
    this.notas = data.notas ?? '';
  }

  validate() {
    const errors = [];

    if (!this.idTipo) errors.push('El tipo de salida es obligatorio');
    if (!this.idProducto) errors.push('El producto es obligatorio');
    if (!this.idDepartamento) errors.push('El departamento es obligatorio');
    if (!this.idUsuario) errors.push('El usuario responsable es obligatorio');
    if (this.cantidad == null || isNaN(this.cantidad) || this.cantidad <= 0)
      errors.push('La cantidad debe ser un número mayor que 0');
    if (!this.fecha) errors.push('La fecha es obligatoria');

    return { isValid: errors.length === 0, errors };
  }

  toDatabase() {
    return {
      idTipo: this.idTipo,
      idProducto: this.idProducto,
      idDepartamento: this.idDepartamento,
      cantidad: this.cantidad,
      idUsuario: this.idUsuario,
      fecha: this.fecha,
      notas: this.notas
    };
  }

  toResponse() {
    return {
      idSalida: this.idSalida,
      idTipo: this.idTipo,
      idProducto: this.idProducto,
      idDepartamento: this.idDepartamento,
      cantidad: this.cantidad,
      idUsuario: this.idUsuario,
      fecha: this.fecha,
      notas: this.notas
    };
  }
}

module.exports = SalidaVO;
