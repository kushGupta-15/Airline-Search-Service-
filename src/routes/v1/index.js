const express = require('express');
const router = express.Router();
const CityController = require('../../controllers/city-controller.js');
const FlightController = require("../../controllers/flight-controller.js");

router.post("/city", CityController.create);
router.get("/city/:id", CityController.get);
router.get("/city", CityController.getAll);
router.delete('/city/:id', CityController.destroy);
router.patch('/city/:id', CityController.update);

router.post('/flights', FlightController.create);

module.exports = router;