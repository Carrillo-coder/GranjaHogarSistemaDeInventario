class LoteVO {
  constructor(data) {
    this.idLotes = data.idLotes || null;
    this.unidadesExistentes = data.unidadesExistentes || 0;
    this.caducidad = data.caducidad || null;
    this.activo = data.activo !== undefined ? data.activo : true;
    this.idProducto = data.idProducto || null;
    this.idEntrada = data.idEntrada || null;
  }

  validate() {
    const errors = [];
    if (this.unidadesExistentes == null || isNaN(this.unidadesExistentes))
      errors.push('Las unidades existentes son obligatorias y deben ser numéricas');
    if (!this.caducidad)
      errors.push('La fecha de caducidad es obligatoria');
    if (!this.idProducto)
      errors.push('El producto asociado es obligatorio');
    return { isValid: errors.length === 0, errors };
  }

  toDatabase() {
    return {
      unidadesExistentes: this.unidadesExistentes,
      caducidad: this.caducidad,
      activo: this.activo,
      idProducto: this.idProducto,
      idEntrada: this.idEntrada
    };
  }

  toResponse() {
    return {
      idLotes: this.idLotes,
      unidadesExistentes: this.unidadesExistentes,
      caducidad: this.caducidad,
      activo: this.activo,
      idProducto: this.idProducto,
      idEntrada: this.idEntrada
    };
  }
}

module.exports = LoteVO;
