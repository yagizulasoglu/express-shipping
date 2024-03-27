"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const shippingSchema = require("../schemas/shippingSchema.json");
const multiShippingSchema = require("../schemas/multiShippingSchema.json");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(
    req.body, shippingSchema, { required: true }
  );

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});

/** POST /ship multi
 *
 * Makes several independent shipping requests:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: [shipId, shipId, ...] }
 */

router.post("/multi", async function (req, res, next) {
  const result = jsonschema.validate(
    req.body, multiShippingSchema, { required: true }
  );

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productIds, name, addr, zip } = req.body;
  const shipIds = await Promise.all(productIds.map(
    async i => await shipProduct({ i, name, addr, zip }
    )));
  return res.json({ shipped: shipIds });
});


module.exports = router;