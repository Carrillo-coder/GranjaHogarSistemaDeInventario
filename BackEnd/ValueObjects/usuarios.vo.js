class UsuarioVO {
    constructor(data) {
        this.idUsuario = data.idUsuario || null;
        this.nombreUsuario = data.nombreUsuario || '';
        this.nombreCompleto = data.nombreCompleto || '';
        this.password = data.password || '';
        this.activo = data.activo !== undefined ? data.activo : true;
        this.idRol = data.idRol || null;
    }

    validate() {
        const errors = [];

        if (!this.nombreUsuario || this.nombreUsuario.trim() === '') {
            errors.push('El nombre de usuario es obligatorio');
        }

        if (!this.nombreCompleto || this.nombreCompleto.trim() === '') {
            errors.push('El nombre completo es obligatorio');
        }

        if (!this.password || this.password.trim() === '') {
            errors.push('La contraseña es obligatoria');
        }

        if (this.password && this.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        if (!this.idRol) {
            errors.push('El rol es obligatorio');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toDatabase() {
        return {
            nombreUsuario: this.nombreUsuario,
            nombreCompleto: this.nombreCompleto,
            password: this.password,
            activo: this.activo,
            idRol: this.idRol
        };
    }

    toResponse() {
        return {
            idUsuario: this.idUsuario,
            nombreUsuario: this.nombreUsuario,
            nombreCompleto: this.nombreCompleto,
            activo: this.activo,
            idRol: this.idRol
        };
    }
}

module.exports = UsuarioVO;