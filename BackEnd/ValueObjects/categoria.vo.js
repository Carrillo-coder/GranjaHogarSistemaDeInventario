class CategoriaVO {
    constructor(data) {
        this.idCategoria = data.idCategoria || null;
        this.Nombre = data.Nombre || '';
    }

    validate() {
        const errors = [];

        if (!this.Nombre || this.Nombre.trim() === '') {
            errors.push('El nombre de la categoría es obligatorio');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toDatabase() {
        return {
            Nombre: this.Nombre
        };
    }

    toResponse() {
        return {
            idCategoria: this.idCategoria,
            Nombre: this.Nombre
        };
    }
}

module.exports = CategoriaVO;
