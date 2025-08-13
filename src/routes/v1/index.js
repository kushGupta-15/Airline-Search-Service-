const express = require('express');
const router = express.Router();
const CityController = require('../../controllers/city-controller.js');

router.post("/city", CityController.create);
router.get("/city/:id", CityController.get);
router.delete('/city/:id', CityController.destroy);
router.patch('/city/:id', CityController.update);

module.exports = router;