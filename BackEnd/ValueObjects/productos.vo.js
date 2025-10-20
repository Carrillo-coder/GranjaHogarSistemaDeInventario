class ProductoVO {
  constructor(data = {}) {
    this.nombre        = (data.nombre || data.Nombre || '').trim();
    this.presentacion  = (data.presentacion || data.Presentacion || '').trim();
    this.categoriaText = (data.categoria || data['categoría'] || '').trim();
    this.idCategoria   = data.idCategoria ?? null;
  }

  static _hasCode(v = '') {
    const re = /(select|insert|update|delete|drop|create|alter)\b|<|>|\/\*|\*\/|--|;|["'`]|[{()}=+*\\/]/i;
    return re.test(v);
  }
  static _onlyLetters(v = '') {
    return /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(v);
  }
  static _presAllowed(v = '') {
    return /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/.test(v);
  }

  validate() {
    const errors = [];
    if (!this.nombre) errors.push('El nombre es obligatorio');
    if (!this.presentacion) errors.push('La presentación es obligatoria');
    if (!this.categoriaText && (this.idCategoria === null || this.idCategoria === undefined)) {
      errors.push('Debe especificar categoría (texto) o idCategoria');
    }

    if (ProductoVO._hasCode(this.nombre) || !ProductoVO._onlyLetters(this.nombre))
      errors.push('Nombre inválido (solo letras y sin código/SQL)');
    if (ProductoVO._hasCode(this.presentacion) || !ProductoVO._presAllowed(this.presentacion))
      errors.push('Presentación inválida (letras/números y sin código/SQL)');
    if (this.categoriaText && (ProductoVO._hasCode(this.categoriaText) || !ProductoVO._onlyLetters(this.categoriaText)))
      errors.push('Categoría inválida (solo letras y sin código/SQL)');

    if (this.idCategoria !== null && this.idCategoria !== undefined) {
      const n = Number(this.idCategoria);
      if (!Number.isInteger(n) || n <= 0) errors.push('idCategoria inválido');
    }

    return { isValid: errors.length === 0, errors };
  }
}

module.exports = ProductoVO;