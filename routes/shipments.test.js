"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct
      .mockReturnValue(9967);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 9967 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if invalid request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 5,
        name: false,
        addr: "100 Test St",
        zip: 12345 - 6789,
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.productId must be greater than or equal to 1000",
      "instance.name is not of a type(s) string",
      "instance.zip is not of a type(s) string"
    ]);
  });
});

describe("POST /multi", function () {
  test("valid", async function () {
    shipItApi.shipProduct
      .mockReturnValue(9967);

    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1000],
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: [9967] });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments/multi")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if invalid request body", async function () {
    const resp = await request(app)
      .post("/shipments/multi")
      .send({
        productIds: 5,
        name: false,
        addr: "100 Test St",
        zip: 12345 - 6789,
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.productIds is not of a type(s) array",
      "instance.name is not of a type(s) string",
      "instance.zip is not of a type(s) string"
    ]);
  });
});


