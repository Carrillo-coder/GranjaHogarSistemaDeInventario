const LotesService = require('../../Services/lotes.service');
const { Producto, Categoria, Lote } = require('../../Models');
const { flattenLotesData } = require('../../utils/flattenLotesData.util');
const { generateXLSX, generatePDF } = require('../../utils/fileGenerator.util');

jest.mock('../../Models', () => ({
  Producto: { findAll: jest.fn() },
}));

jest.mock('../../utils/flattenLotesData.util', () => ({
  flattenLotesData: jest.fn(),
}));

jest.mock('../../utils/fileGenerator.util', () => ({
  generateXLSX: jest.fn(),
  generatePDF: jest.fn(),
}));

describe('LotesService Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generarReporteLotes', () => {

    test('Given productos exist and formato=XLSX, When generarReporteLotes, Then XLSX buffer and filename', async () => {
      // GIVEN
      const mockProductos = [
        { idProducto: 1, nombre: 'Agua', presentacion: '1L', categoria: { nombre: 'Bebida' }, lotes: [] },
      ];
      Producto.findAll.mockResolvedValue(mockProductos);
      flattenLotesData.mockReturnValue([
        { Producto: 'Agua', 'Unidades Existentes': 10 }
      ]);
      const mockBuffer = Buffer.from('XLSX_BUFFER');
      generateXLSX.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await LotesService.generarReporteLotes('XLSX');

      // THEN
      expect(generateXLSX).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({ titulo: 'Reporte General de Inventario' })
      );
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result).toHaveProperty('buffer', mockBuffer);
      expect(result.filename).toMatch(/\.xlsx$/i);
    });

    test('Given productos exist and formato=PDF, When generarReporteLotes, Then PDF buffer and filename', async () => {
      // GIVEN
      const mockProductos = [
        { idProducto: 2, nombre: 'Jugo', presentacion: '500ml', categoria: { nombre: 'Bebida' }, lotes: [] },
      ];
      Producto.findAll.mockResolvedValue(mockProductos);
      flattenLotesData.mockReturnValue([
        { Producto: 'Jugo', 'Unidades Existentes': 5 }
      ]);
      const mockBuffer = Buffer.from('PDF_BUFFER');
      generatePDF.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await LotesService.generarReporteLotes('PDF');

      // THEN
      expect(generatePDF).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({ titulo: 'Reporte General de Inventario' }),
        expect.any(Array) // table headers
      );
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result).toHaveProperty('buffer', mockBuffer);
      expect(result.filename).toMatch(/\.pdf$/i);
    });

    test('Given no productos, When generarReporteLotes, Then XLSX/ PDF still returns empty report', async () => {
      // GIVEN
      Producto.findAll.mockResolvedValue([]);
      flattenLotesData.mockReturnValue([]);

      const mockBuffer = Buffer.from('EMPTY_BUFFER');
      generateXLSX.mockResolvedValue(mockBuffer);

      // WHEN
      const result = await LotesService.generarReporteLotes('XLSX');

      // THEN
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.buffer).toBe(mockBuffer);
      expect(result.filename).toMatch(/\.xlsx$/i);
    });

  });
});
