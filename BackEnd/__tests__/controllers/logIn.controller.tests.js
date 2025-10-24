const request = require('supertest');
const server = require('../../app');
const db = require("../../Models");

jest.mock("../../Models", () => {
  return {
    Conversion: {
        create: jest.fn().mockImplementation((conversion) => Promise.resolve(conversion))
    },
    sequelize: {
      sync: jest.fn().mockImplementation(() => Promise.resolve())
    }
  };
});

describe("Log-In Controller Tests", () => {
    afterAll(async () => {
        await server.close();
        await db.sequelize.sync.mockClear();
        await db.Conversion.create.mockClear();
    });

    test("given a wrong user and a password then 404 user not found", async () => {
        return request(server)
            .post('/v1/temperature/convert/FAHRENHEIT')
            .send({ unit: "CELSIUS" })
            .expect(400);
    });

    test("Given Temperature with missing unit When convert Then Error 400", async () => {
        return request(server)
            .post('/v1/temperature/convert/FAHRENHEIT')
            .send({ value: 20 })
            .expect(400);
    });

    test("Given Temperature and missing unit to convert When convert Then Error 404", async () => {
        return request(server)
            .post('/v1/temperature/convert')
            .send({ value: 20, unit: "CELSIUS" })
            .expect(404);
    });

    test("Given Temperature and invalid unit to convert When convert Then Error 400", async () => {
        return request(server)
            .post('/v1/temperature/convert/KELVIN')
            .send({ value: 20, unit: "CELSIUS" })
            .expect(400);
    });

    test("Given Temperature with invalid value When convert Then Error 400", async () => {
        return request(server)
            .post('/v1/temperature/convert/FAHRENHEIT')
            .send({ value: "A", unit: "CELSIUS" })
            .expect(400);
    });

    test("Given Temperature with invalid unit When convert Then Error 400", async () => {
        return request(server)
            .post('/v1/temperature/convert/FAHRENHEIT')
            .send({ value: 20, unit: "KELVIN" })
            .expect(400);
    });

    test("Given Temperature When convert Then Status 200", async () => {
        const unit = "CELSIUS";
        const value = 20;

        return request(server)
            .post('/v1/temperature/convert/FAHRENHEIT')
            .send({ value: value, unit: unit })
            .expect(200)
            .then((res) => {
                expect(res.body.value).toEqual(68);
                expect(res.body.unit).toEqual("FAHRENHEIT");
            });
    });
})