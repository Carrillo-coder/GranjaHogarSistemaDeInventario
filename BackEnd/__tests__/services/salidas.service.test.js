const SalidasService = require('../../Services/salidas.service');
const db = require('../../Models');
const { flattenSalidasData } = require('../../utils/flattenSalidasData.util');
const { generateXLSX, generatePDF } = require('../../utils/fileGenerator.util');

jest.mock('../../Models', () => ({
  Salida: { findAll: jest.fn() },
},
  db.Sequelize = {
    Op: {
      between: Symbol('between')
    }
  }
));
jest.mock('../../utils/flattenSalidasData.util', () => ({
  flattenSalidasData: jest.fn(),
}));
jest.mock('../../utils/fileGenerator.util', () => ({
  generateXLSX: jest.fn(),
  generatePDF: jest.fn(),
}));

describe('SalidasService Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generarReporteSalidas', () => {

    const mockFechaInicio = '2025-10-01';
    const mockFechaFin = '2025-10-15';

    test('Given entries exist and formato=XLSX, When generarReporteSalidas, Then XLSX buffer and filename', async () => {
      // GIVEN
      const mockSalidas = [{ id: 1, fecha: mockFechaInicio }];
      db.Salida.findAll.mockResolvedValue(mockSalidas);
      flattenSalidasData.mockReturnValue([
        { Producto: 'Agua', 'Cantidad Total': 10 },
      ]);
      const mockBuffer = Buffer.from('XLSX_BUFFER');
      generateXLSX.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await SalidasService.generarReporteSalidas({
        fechaInicio: mockFechaInicio,
        fechaFin: mockFechaFin,
        formato: 'XLSX',
      });

      // THEN
      expect(generateXLSX).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result).toHaveProperty('buffer', mockBuffer);
      expect(result.filename).toMatch(/\.xlsx$/i);
    });

    test('Given entries exist and formato=PDF, When generarReporteSalidas, Then PDF buffer and filename', async () => {
      // GIVEN
      const mockSalidas = [{ id: 2, fecha: mockFechaFin }];
      db.Salida.findAll.mockResolvedValue(mockSalidas);
      flattenSalidasData.mockReturnValue([
        { Producto: 'Jugo', 'Cantidad Total': 5 },
      ]);
      const mockBuffer = Buffer.from('PDF_BUFFER');
      generatePDF.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await SalidasService.generarReporteSalidas({
        fechaInicio: mockFechaInicio,
        fechaFin: mockFechaFin,
        formato: 'PDF',
      });

      // THEN
      expect(generatePDF).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result).toHaveProperty('buffer', mockBuffer);
      expect(result.filename).toMatch(/\.pdf$/i);
    });

    test('Given no entries found, When generarReporteSalidas called, Then throws an error', async () => {
      // GIVEN
      db.Salida.findAll.mockResolvedValue([]);

      // WHEN & THEN
      await expect(
        SalidasService.generarReporteSalidas({
          fechaInicio: mockFechaInicio,
          fechaFin: mockFechaFin,
          formato: 'PDF',
        })
      ).rejects.toThrow('No se encontraron salidas para el rango de fechas dado.');
    });
  });
});
