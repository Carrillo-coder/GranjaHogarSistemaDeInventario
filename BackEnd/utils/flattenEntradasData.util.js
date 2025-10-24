function flattenEntradasData(entradas) {
    const flattened = [];

    entradas.forEach((entrada, index) => {
        const tipoEntrada = entrada.tipoEntrada?.nombre || '';
        const usuario = entrada.usuario?.nombreCompleto || '';
        const rol = entrada.usuario?.rol?.nombre || '';

        entrada.lotes.forEach((lote) => {
            const producto = lote.producto?.nombre || '';
            const categoria = lote.producto?.categoria?.nombre || '';
            const presentacion = lote.producto?.presentacion || '';

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
module.exports = { flattenEntradasData };