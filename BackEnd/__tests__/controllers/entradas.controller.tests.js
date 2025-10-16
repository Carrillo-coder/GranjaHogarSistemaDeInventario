const request = require('supertest');
const server = require('../../app');
const EntradasService = require('../../Services/entradas.service');
const ReportesVO = require('../../ValueObjects/reportes.vo');

jest.mock('../../Services/entradas.service', () => ({
    generarReporteEntradas: jest.fn(),
}));

describe("Entradas Controller Tests", () => {
    test("Given missing fechaInicio When getReporteEntradas Then Error 400", async () => {
        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaFin: "2025-10-15",
                formato: "CSV"
            })
            .expect(400)
            .then((res) => {
                expect(res.body.errors).toContain("La fecha de inicio es obligatoria");
            });
    });

    test("Given invalid fechaInicio format When getReporteEntradas Then Error 400", async () => {
        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025/32/01",
                fechaFin: "2025-10-15",
                formato: "CSV"
            })
            .expect(400)
            .then((res) => {
                expect(res.body.errors).toContain("La fecha de inicio no es válida");
            });
    });

    test("Given fechaInicio > fechaFin When getReporteEntradas Then Error 400", async () => {
        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025-10-15",
                fechaFin: "2025-10-01",
                formato: "CSV"
            })
            .expect(400)
            .then((res) => {
                expect(res.body.errors).toContain("La fecha de inicio no puede ser posterior a la fecha de fin");
            });
    });

    test("Given missing formato When getReporteEntradas Then Error 400", async () => {
        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025-10-01",
                fechaFin: "2025-10-15"
            })
            .expect(400)
            .then((res) => {
                expect(res.body.errors).toContain("El formato es obligatorio");
            });
    });

    test("Given invalid formato When getReporteEntradas Then Error 400", async () => {
        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025-10-01",
                fechaFin: "2025-10-15",
                formato: "XLSX"
            })
            .expect(400)
            .then((res) => {
                expect(res.body.errors).toContain("El formato debe ser CSV o PDF");
            });
    });

    test("Given valid ReporteVO When getReporteEntradas Then Status 200", async () => {
        const mockFilePath = "/tmp/reporteEntradas.csv";
        EntradasService.generarReporteEntradas.mockResolvedValue(mockFilePath);

        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025-10-01",
                fechaFin: "2025-10-15",
                formato: "CSV"
            })
            .expect(200)
            .then(() => {
                expect(EntradasService.generarReporteEntradas).toHaveBeenCalledTimes(1);
            });
    });

    test("Given service throws error When getReporteEntradas Then Error 500", async () => {
        EntradasService.generarReporteEntradas.mockRejectedValue(new Error("Falla en el servicio"));

        return request(server)
            .post('/api/inventario/entradas/reportes')
            .send({
                fechaInicio: "2025-10-01",
                fechaFin: "2025-10-15",
                formato: "PDF"
            })
            .expect(500)
            .then((res) => {
                expect(res.body.message).toEqual("Error interno del servidor");
            });
    });
});
