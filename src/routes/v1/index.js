const express = require('express');
const router = express.Router();
const CityController = require('../../controllers/city-controller.js');
const FlightController = require("../../controllers/flight-controller.js");
const AirportController = require("../../controllers/airport-controller.js")

const { FlightMiddlewares, InternalAuthMiddleware } = require('../../middlewares/index.js');

router.post("/city", CityController.create);
router.get("/city/:id", CityController.get);
router.get("/city", CityController.getAll);
router.delete('/city/:id', CityController.destroy);
router.patch('/city/:id', CityController.update);

router.post('/flights', FlightMiddlewares.validateCreateFlight, FlightController.create);
router.get('/flights', FlightController.getAll);
router.get('/flights/:id', FlightController.get);
router.patch('/flights/:id', InternalAuthMiddleware.verifyServiceToken, FlightController.update);

router.post('/airports', AirportController.create);
router.get('/airports', AirportController.getAll);
router.get('/airports/:id', AirportController.get);

module.exports = router;