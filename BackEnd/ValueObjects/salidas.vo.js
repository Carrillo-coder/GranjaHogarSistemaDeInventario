
class SalidaVO {
  constructor(data) {
    this.ID_Salida = data.ID_Salida;
    this.ID_Tipo = data.ID_Tipo;
    this.ID_Departamentos = data.ID_Departamentos;
    this.cantidad = data.cantidad;
    this.ID_Usuario = data.ID_Usuario;
    this.fecha = data.fecha;
    this.notas = data.notas;
  }
}

module.exports = SalidaVO;
