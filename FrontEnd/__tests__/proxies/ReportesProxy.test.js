import ReportesServiceProxy from "../../proxies/ReportesServiceProxy";

global.fetch = jest.fn();

describe("ReportesServiceProxy unit tests", () => {
    const { generarReporteEntradas, generarReporteSalidas, generarReporteLotes } = ReportesServiceProxy();
    
    beforeEach(() => {
        jest.mock('@env');
    });
    afterEach(() => {
        fetch.mockClear();
    });

    test("Given ReporteVO When generarReporteEntradas Then returns blob and filename", async () => {
        const mockResponse = new Blob(["test content"]);
        const mockFilename = "reporte_entradas.pdf";
        const reporteVO = { fechaInicio: "2024-01-01", fechaFin: "2024-01-31", formato: "PDF" };

        fetch.mockResolvedValueOnce({
            ok: true,
            blob: async () => mockResponse,
            headers: {
                get: () => `attachment; filename=${mockFilename}`,
            },
        });

        const result = await generarReporteEntradas(reporteVO);

        expect(result.blob).toBe(mockResponse);
        expect(result.filename).toBe(mockFilename);
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/inventario/entradas/reportes',
            expect.objectContaining({
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reporteVO),
            })
        );
    });

    test("Given ReporteVO and departamento When generarReporteSalidas Then returns blob and filename", async () => {
        const mockResponse = new Blob(["test content"]);
        const mockFilename = "reporte_salidas.xlsx";
        const reporteVO = { fechaInicio: "2024-02-01", fechaFin: "2024-02-28", formato: "XLSX" };
        const departamento = "Ventas";

        fetch.mockResolvedValueOnce({
            ok: true,
            blob: async () => mockResponse,
            headers: {
                get: () => `attachment; filename=${mockFilename}`,
            },
        });

        const result = await generarReporteSalidas(reporteVO, departamento);

        expect(result.blob).toBe(mockResponse);
        expect(result.filename).toBe(mockFilename);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/inventario/salidas/reportes?departamento=${departamento}`,
             expect.objectContaining({
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reporteVO),
            })
        );
    });

    test("Given formato When generarReporteLotes Then returns blob and filename", async () => {
        const mockResponse = new Blob(["test content"]);
        const mockFilename = "reporte_lotes.pdf";
        const formato = "PDF";

        fetch.mockResolvedValueOnce({
            ok: true,
            blob: async () => mockResponse,
            headers: {
                get: () => `attachment; filename=${mockFilename}`,
            },
        });

        const result = await generarReporteLotes(formato);

        expect(result.blob).toBe(mockResponse);
        expect(result.filename).toBe(mockFilename);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/inventario/lotes/reportes?formato=${formato}`,
            expect.objectContaining({
                method: "GET",
            })
        );
    });
});