class ProductoVO {
    constructor(data) {
        this.idProducto = data.idProducto || null;
        this.Nombre = data.Nombre || '';
        this.Presentacion = data.Presentacion || '';
        this.idCategoria = data.idCategoria || null;
    }

    validate() {
        const errors = [];

        if (!this.Nombre || this.Nombre.trim() === '') {
            errors.push('El nombre del producto es obligatorio');
        }

        if (!this.Presentacion || this.Presentacion.trim() === '') {
            errors.push('La presentación del producto es obligatoria');
        }

        if (!this.idCategoria) {
            errors.push('La categoría del producto es obligatoria');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toDatabase() {
        return {
            Nombre: this.Nombre,
            Presentacion: this.Presentacion,
            idCategoria: this.idCategoria
        };
    }

    toResponse() {
        return {
            idProducto: this.idProducto,
            Nombre: this.Nombre,
            Presentacion: this.Presentacion,
            idCategoria: this.idCategoria
        };
    }
}

module.exports = ProductoVO;
