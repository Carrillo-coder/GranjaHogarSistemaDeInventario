export function flattenSalidasData(salidas) {
    const flattened = [];

    salidas.forEach((salida) => {
        const tipoSalida = salida.TipoSalida?.nombre || '';
        const departamento = salida.Departamento?.nombre || '';
        const usuario = salida.Usuario?.nombreCompleto || '';
        const rol = salida.Usuario?.Rol?.nombre || '';
        const producto = salida.Producto?.nombre || '';
        const categoria = salida.Producto?.Categoria?.nombre || '';
        const presentacion = salida.Producto?.presentacion || '';

        flattened.push({
            Fecha: salida.fecha,
            Departamento: departamento,
            Producto: producto,
            Categoría: categoria,
            Presentación: presentacion,
            Cantidad: salida.cantidad,
            'Tipo Salida': tipoSalida,
            'Usuario Responsable': usuario,
            'Rol Usuario': rol,
            Notas: salida.notas || '',
        });
    });

    return flattened;
}
