function flattenSalidasData(salidas) {
  const flattened = [];

  salidas.forEach((salida, index) => {
    const tipoSalida = salida.tipoSalida?.nombre || '';
    const departamento = salida.departamento?.nombre || '';
    const usuario = salida.usuario?.nombreCompleto || '';
    const rol = salida.usuario?.rol?.nombre || '';
    const producto = salida.producto?.nombre || '';
    const categoria = salida.producto?.categoria?.nombre || '';
    const presentacion = salida.producto?.presentacion || '';

    flattened.push({
      'No.': index + 1,
      Fecha: salida.fecha,
      Departamento: departamento,
      Producto: producto,
      Categoría: categoria,
      Presentación: presentacion,
      'Cantidad Retirada': salida.cantidad,
      'Tipo Salida': tipoSalida,
      'Usuario Responsable': usuario,
      'Rol Usuario': rol,
      Notas: salida.notas || '',
    });
  });

  return flattened;
}

module.exports = { flattenSalidasData };