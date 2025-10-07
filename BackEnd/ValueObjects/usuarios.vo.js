/**
 * Value Object para Usuario
 * Define la estructura y validación de datos de un usuario
 */
class UsuarioVO {
    constructor(data) {
        this.ID_Usuario = data.ID_Usuario || null;
        this.nombreUsuario = data.nombreUsuario || '';
        this.nombreCompleto = data.nombreCompleto || '';
        this.password = data.password || '';
        this.activo = data.activo !== undefined ? data.activo : true;
        this.ID_Rol = data.ID_Rol || null;
    }

    // Validar datos del usuario
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

        if (!this.ID_Rol) {
            errors.push('El rol es obligatorio');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convertir a objeto para insert/update
    toDatabase() {
        return {
            nombreUsuario: this.nombreUsuario,
            nombreCompleto: this.nombreCompleto,
            password: this.password,
            activo: this.activo,
            ID_Rol: this.ID_Rol
        };
    }

    // Convertir a objeto para respuesta (sin password)
    toResponse() {
        return {
            ID_Usuario: this.ID_Usuario,
            nombreUsuario: this.nombreUsuario,
            nombreCompleto: this.nombreCompleto,
            activo: this.activo,
            ID_Rol: this.ID_Rol
        };
    }
}

module.exports = UsuarioVO;