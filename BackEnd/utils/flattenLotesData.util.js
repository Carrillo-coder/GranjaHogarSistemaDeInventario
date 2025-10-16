exports.flattenLotesData = (productos) => {
    const flattened = [];

    productos.forEach((producto) => {
        const categoria = producto.Categoria?.nombre || '';
        const presentacion = producto.presentacion || '';

        const lotesActivos = (producto.Lotes || []).filter(l => l.activo);

        lotesActivos.forEach((lote) => {
            flattened.push({
                'Producto': producto.nombre,
                'Categoría': categoria,
                'Presentación': presentacion,
                'ID Lote': lote.idLote,
                'Unidades Existentes': lote.unidadesExistentes,
                'Caducidad': lote.caducidad,
                'Activo': lote.activo ? 'Sí' : 'No',
                'Total por Producto': ''
            });
        });
        
        if (lotesActivos.length > 0) {
            const totalUnidades = lotesActivos.reduce(
                (sum, l) => sum + (l.unidadesExistentes || 0),
                0
            );

            flattened.push({
                'Producto': '',
                'Categoría': '',
                'Presentación': '',
                'ID Lote': '',
                'Unidades Existentes': '',
                'Caducidad': '',
                'Activo': 'TOTAL:',
                'Total por Producto': totalUnidades
            });
        }
    });

    return flattened;
};
