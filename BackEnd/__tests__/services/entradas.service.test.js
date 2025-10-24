const EntradasService = require('../../Services/entradas.service');
const db = require('../../Models');
const { flattenEntradasData } = require('../../utils/flattenEntradasData.util');
const { generateXLSX, generatePDF } = require('../../utils/fileGenerator.util');

jest.mock('../../Models', () => ({
  Entrada: { findAll: jest.fn() },
}));
jest.mock('../../utils/flattenEntradasData.util', () => ({
  flattenEntradasData: jest.fn(),
}));
jest.mock('../../utils/fileGenerator.util', () => ({
  generateXLSX: jest.fn(),
  generatePDF: jest.fn(),
}));

describe('EntradasService Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generarReporteEntradas', () => {

    const mockFechaInicio = '2025-10-01';
    const mockFechaFin = '2025-10-15';

    test('Given entries exist and formato=XLSX, When generarReporteEntradas, Then XLSX buffer and filename', async () => {
      // GIVEN
      const mockEntradas = [{ id: 1, fecha: mockFechaInicio }];
      db.Entrada.findAll.mockResolvedValue(mockEntradas);
      flattenEntradasData.mockReturnValue([
        { Producto: 'Agua', 'Cantidad Total': 10 },
      ]);
      const mockBuffer = Buffer.from('XLSX_BUFFER');
      generateXLSX.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await EntradasService.generarReporteEntradas({
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

    test('Given entries exist and formato=PDF, When generarReporteEntradas, Then PDF buffer and filename', async () => {
      // GIVEN
      const mockEntradas = [{ id: 2, fecha: mockFechaFin }];
      db.Entrada.findAll.mockResolvedValue(mockEntradas);
      flattenEntradasData.mockReturnValue([
        { Producto: 'Jugo', 'Cantidad Total': 5 },
      ]);
      const mockBuffer = Buffer.from('PDF_BUFFER');
      generatePDF.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await EntradasService.generarReporteEntradas({
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

    test('Given no entries found, When generarReporteEntradas called, Then throws an error', async () => {
      // GIVEN
      db.Entrada.findAll.mockResolvedValue([]);

      // WHEN & THEN
      await expect(
        EntradasService.generarReporteEntradas({
          fechaInicio: mockFechaInicio,
          fechaFin: mockFechaFin,
          formato: 'PDF',
        })
      ).rejects.toThrow('No se encontraron entradas para el rango de fechas dado.');
    });
  });
});
