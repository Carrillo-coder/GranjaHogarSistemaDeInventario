exports.flattenLotesData = (productos) => {
    const flattened = [];
    //const contador = 1;

    productos.forEach((producto, index) => {
        const categoria = producto.Categoria?.nombre || '';
        const presentacion = producto.presentacion || '';

        const lotesActivos = (producto.Lotes || []).filter(l => l.activo);

        lotesActivos.forEach((lote) => {
            flattened.push({
                'No.': index + 1,
                'Producto': producto.nombre,
                'Categoría': categoria,
                'Presentación': presentacion,
                'ID Lote': lote.idLotes,
                'Unidades Existentes': lote.unidadesExistentes,
                'Caducidad': lote.caducidad,
                'Total por Producto': ''
            });
        });
        
        if (lotesActivos.length > 0) {
            const totalUnidades = lotesActivos.reduce(
                (sum, l) => sum + (l.unidadesExistentes || 0),
                0
            );

            flattened.push({
                'No.': '',
                'Producto': '',
                'Categoría': '',
                'Presentación': '',
                'ID Lote': '',
                'Unidades Existentes': '',
                'Caducidad': 'TOTAL',
                'Total por Producto': totalUnidades
            });
        }
    });

    return flattened;
};
