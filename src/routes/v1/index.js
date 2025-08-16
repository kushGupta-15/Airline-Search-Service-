const express = require('express');
const router = express.Router();
const CityController = require('../../controllers/city-controller.js');
const FlightController = require("../../controllers/flight-controller.js");
const AirportController = require("../../controllers/airport-controller.js")

const {FlightMiddlewares} = require('../../middlewares/index.js');

router.post("/city", CityController.create);
router.get("/city/:id", CityController.get);
router.get("/city", CityController.getAll);
router.delete('/city/:id', CityController.destroy);
router.patch('/city/:id', CityController.update);

router.post('/flights', FlightMiddlewares.validateCreateFlight,FlightController.create);
router.get('/flights', FlightController.getAll);
router.get('/flights/:id', FlightController.get);

router.post('/airports', AirportController.create);

module.exports = router;