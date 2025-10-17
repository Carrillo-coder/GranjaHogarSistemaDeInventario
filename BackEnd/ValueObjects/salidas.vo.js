
class SalidaVO {
  constructor(data) {
    this.idSalida = data.idSalida;
    this.idTipo = data.idTipo;
    this.idProducto = data.idProducto;
    this.idDepartamento = data.idDepartamento;
    this.Cantidad = data.Cantidad;
    this.idUsuario = data.idUsuario;
    this.Fecha = data.Fecha;
    this.Notas = data.Notas;
  }
}

module.exports = SalidaVO;
