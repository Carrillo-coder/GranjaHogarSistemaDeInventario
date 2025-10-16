class ProductoVO {
  constructor(data = {}) {
    this.nombre = (data.nombre || '').trim();
    this.presentacion = (data.presentacion || '').trim();
    this.categoria = (data.categoria || data.categoría || '').trim();
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
    if (!this.categoria) errors.push('La categoría es obligatoria');

    if (ProductoVO._hasCode(this.nombre) || !ProductoVO._onlyLetters(this.nombre))
      errors.push('Nombre inválido (solo letras y sin código/SQL)');
    if (ProductoVO._hasCode(this.categoria) || !ProductoVO._onlyLetters(this.categoria))
      errors.push('Categoría inválida (solo letras y sin código/SQL)');
    if (ProductoVO._hasCode(this.presentacion) || !ProductoVO._presAllowed(this.presentacion))
      errors.push('Presentación inválida (letras/números y sin código/SQL)');

    return { isValid: errors.length === 0, errors };
  }
}

module.exports = ProductoVO;
