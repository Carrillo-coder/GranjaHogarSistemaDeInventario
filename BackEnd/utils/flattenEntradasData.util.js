export function flattenEntradasData(entradas) {
    const flattened = [];

    entradas.forEach((entrada, index) => {
        const tipoEntrada = entrada.TipoEntrada?.nombre || '';
        const usuario = entrada.Usuario?.nombreCompleto || '';
        const rol = entrada.Usuario?.Rol?.nombre || '';

        entrada.Lotes.forEach((lote) => {
            const producto = lote.Producto?.nombre || '';
            const categoria = lote.Producto?.Categoria?.nombre || '';
            const presentacion = lote.Producto?.presentacion || '';

            flattened.push({
                'No.': index + 1,
                Fecha: entrada.fecha,
                Producto: producto,
                Categoria: categoria,
                Presentacion: presentacion,
                'Cantidad Total': lote.cantidad,
                Lote: lote.idLotes,
                'Unidades Restantes': lote.unidadesExistentes,
                Caducidad: lote.caducidad,
                Activo: lote.activo ? 'Sí' : 'No',
                Proveedor: entrada.proveedor,
                'Tipo Entrada': tipoEntrada,
                'Usuario Responsable': usuario,
                'Rol Usuario': rol,
                Notas: entrada.notas || '',
            });
        });
    });

    return flattened;
}