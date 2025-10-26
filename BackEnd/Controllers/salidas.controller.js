const SalidasService = require('../Services/salidas.service');
const ReportesVO = require('../ValueObjects/reportes.vo');
const db = require('../Models');
const { Lote, Salida, Producto } = db;
const { Op } = require('sequelize');

class SalidaController {

    static async getReporteSalidas(req, res) {
        try {
            const { departamento } = req.query;
            const data = req.body;
            const reporteVO = new ReportesVO(data);
            const validation = reporteVO.validate();

            if (!validation.isValid) {
                return res.status(400).json({ errors: validation.errors });
            }

            if (!departamento || departamento.trim() === '') {
                return res.status(400).json({ error: 'El parámetro "departamento" es obligatorio.' });
            }

            const { buffer, filename } = await SalidasService.generarReporteSalidas(reporteVO, departamento);

            const base64 = buffer.toString('base64');
            const mimeType = reporteVO.formato === 'PDF'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            return res.status(200).json({
                success: true,
                filename,
                mimeType,
                base64,
            });

        } catch (error) {
            console.error('Error al generar el reporte de salidas:', error);
            return res.status(500).json({
                success: false,
                message: 'No se encontraron registros para el reporte de salidas',
                error: error.message
            });
        }
    }

    static async getAllSalidas(req, res) {
        try {
            const salidas = await Salida.findAll({ include: [{ all: true }] });
            res.status(200).json(salidas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las salidas' });
        }
    }

    static async getSalidaById(req, res) {
        try {
            const { id } = req.params;
            const salida = await Salida.findByPk(id, { include: [{ all: true }] });
            if (!salida) return res.status(404).json({ message: 'Salida no encontrada' });
            res.status(200).json(salida);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la salida' });
        }
    }

    static async createSalida(req, res) {
        console.log('--- INICIANDO CREATE SALIDA ---');
        console.log('BODY RECIBIDO:', JSON.stringify(req.body, null, 2));

        const body = req.body;

        if (Array.isArray(body)) {
            console.log('Detectado lote de salidas. Cantidad de productos:', body.length);
            const idGrupoSalida = Date.now(); 
            const transaction = await db.sequelize.transaction();
            const salidasCreadas = [];

            try {
                let i = 0;
                for (const salidaData of body) {
                    console.log(`Procesando producto ${++i} de ${body.length}:`, salidaData.nombre);
                    const nuevaSalida = await SalidaController._procesarSalidaUnica(salidaData, transaction, idGrupoSalida);
                    salidasCreadas.push(nuevaSalida);
                }

                await transaction.commit();
                console.log('--- LOTE PROCESADO CON ÉXITO ---');
                res.status(201).json({
                    message: 'Salidas por lote procesadas con éxito.',
                    salidas: salidasCreadas
                });

            } catch (error) {
                await transaction.rollback();
                console.error('Error en salida por lote:', error);
                res.status(400).json({
                    message: `Fallo en el procesamiento del lote: ${error.message}`,
                    error: error.message
                });
            }

        } else {
            console.log('Detectada salida única.');
            // Procesar como una salida única
            const transaction = await db.sequelize.transaction();
            try {
                const nuevaSalida = await SalidaController._procesarSalidaUnica(body, transaction, null);
                await transaction.commit();
                
                const salidaFinal = await Salida.findByPk(nuevaSalida.idSalida, {
                    include: [{ all: true }]
                });
                console.log('--- SALIDA ÚNICA PROCESADA CON ÉXITO ---');
                res.status(201).json(salidaFinal);

            } catch (error) {
                await transaction.rollback();
                console.error('Error al registrar la salida:', error);
                res.status(400).json({
                    message: `Fallo en el procesamiento de la salida: ${error.message}`,
                    error: error.message
                });
            }
        }
    }

    /**
     * Método privado para procesar una única salida, descontando de lotes (PEPS).
     * Este método está diseñado para ser llamado con una transacción existente.
     */
    static async _procesarSalidaUnica(salidaData, transaction, idGrupoSalida) {
        const { idTipo, idDepartamento, idProducto, nombreProducto, cantidad, idUsuario, fecha, notas } = salidaData;

        let idProductoDefinitivo = idProducto;

        if (!idProductoDefinitivo && nombreProducto) {
            const producto = await Producto.findOne({ where: { nombre: nombreProducto }, transaction });
            if (producto) {
                idProductoDefinitivo = producto.idProducto || producto.id;
            } else {
                throw new Error(`Producto no encontrado con el nombre "${nombreProducto}".`);
            }
        }

        const idProductoValidado = parseInt(idProductoDefinitivo, 10);
        let cantidadPendiente = parseInt(cantidad, 10);

        if (isNaN(idProductoValidado) || idProductoValidado <= 0) {
            throw new Error('ID de producto no válido.');
        }
        if (isNaN(cantidadPendiente) || cantidadPendiente <= 0) {
            throw new Error('La cantidad debe ser un número positivo.');
        }

        const lotesDisponibles = await Lote.findAll({
            where: {
                idProducto: idProductoValidado,
                unidadesExistentes: { [Op.gt]: 0 },
                activo: true
            },
            order: [['caducidad', 'ASC']],
            transaction
        });

        const stockTotal = lotesDisponibles.reduce((sum, lote) => sum + lote.unidadesExistentes, 0);

        if (stockTotal < cantidadPendiente) {
            const productoInfo = await Producto.findByPk(idProductoValidado, { transaction });
            throw new Error(`Stock insuficiente para "${productoInfo?.nombre || 'Producto desconocido'}". Solicitado: ${cantidad}, Disponible: ${stockTotal}.`);
        }

        for (const lote of lotesDisponibles) {
            if (cantidadPendiente <= 0) break;
            const disponibleEnLote = lote.unidadesExistentes;
            if (cantidadPendiente >= disponibleEnLote) {
                lote.unidadesExistentes = 0;
                lote.activo = false;
                cantidadPendiente -= disponibleEnLote;
            } else {
                lote.unidadesExistentes -= cantidadPendiente;
                cantidadPendiente = 0;
            }
            await lote.save({ transaction });
        }

        let notasFinales = notas || '';
        if (idGrupoSalida) {
            const grupoTag = `id_grupo_salida:${idGrupoSalida}`;
            notasFinales = notas ? `${notas}; ${grupoTag}` : grupoTag;
        }

        const nuevaSalida = await Salida.create({
            idTipo,
            idDepartamento,
            cantidad,
            idUsuario,
            fecha,
            notas: notasFinales,
            idProducto: idProductoValidado
        }, { transaction });

        const nuevoStockTotal = await Lote.sum('unidadesExistentes', {
            where: { idProducto: idProductoValidado, activo: true },
            transaction
        });

        if (nuevoStockTotal === 0) {
            await Producto.update({ activo: false }, { where: { idProducto: idProductoValidado }, transaction });
        }

        return nuevaSalida;
    }
}

module.exports = SalidaController;