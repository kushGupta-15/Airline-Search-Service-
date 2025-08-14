const { CityService } = require("../services/index.js");

const cityService = new CityService();

const create = async (req, res) => {
  try {
    const city = await cityService.createCity(req.body);
    res.status(201).json({
      data: city,
      success: true,
      message: "City created successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in create in city-controller");
    res.status(500).json({
      data: {},
      success: false,
      message: "Not able to create a city",
      err: error,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const city = await cityService.deleteCity(req.params.id);
    return res.status(200).json({
      data: city,
      success: true,
      message: "City deleted successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in destroy in city-controller");
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to delete a city",
      err: error,
    });
  }
};

const update = async (req, res) => {
  try {
    const city = await cityService.updateCity(req.params.id, req.body);
    res.status(200).json({
      data: city,
      success: true,
      message: "City updated successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in update in city-controller");
    res.status(500).json({
      data: {},
      success: false,
      message: "Not able to create a city",
      err: error,
    });
  }
};

const get = async (req, res) => {
  try {
    const city = await cityService.getCity(req.params.id);
    return res.status(200).json({
      data: city,
      success: true,
      message: "City found",
      err: {},
    });
  } catch (error) {
    console.log("Error in get in city-controller");
    res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the city",
      err: error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    return res.status(200).json({
      data: cities,
      success: true,
      message: "Cities found",
      err: {},
    });
  } catch (error) {
    console.log("Error in getAll in city-controller");
    res.status(500).json({
      data: {},
      success: false,
      message: "Not able to fetch the cities",
      err: error,
    });
  }
};

module.exports = {
  create,
  destroy,
  update,
  get,
  getAll
};
