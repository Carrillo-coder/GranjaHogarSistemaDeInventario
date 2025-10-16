export function flattenEntradasData(entradas) {
    const flattened = [];

    entradas.forEach((entrada) => {
        const tipoEntrada = entrada.TipoEntrada?.nombre || '';
        const usuario = entrada.Usuario?.nombreCompleto || '';
        const rol = entrada.Usuario?.Rol?.nombre || '';

        entrada.Lotes.forEach((lote) => {
            const producto = lote.Producto?.nombre || '';
            const categoria = lote.Producto?.Categoria?.nombre || '';
            const presentacion = lote.Producto?.presentacion || '';

            flattened.push({
                Fecha: entrada.fecha,
                Producto: producto,
                Categoría: categoria,
                Presentación: presentacion,
                'Cantidad Total': entrada.cantidad,
                Lote: lote.idLote,
                'Unidades Lote': lote.unidadesExistentes,
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