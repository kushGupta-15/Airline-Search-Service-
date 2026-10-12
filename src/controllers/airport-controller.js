const { AirportService } = require("../services/index.js");

const airportService = new AirportService();

const create = async (req, res) => {
  try {
    const response = await airportService.create(req.body);
    return res.status(201).json({
      data: response,
      success: true,
      message: "Airport created successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in create in airport controller");
    return res.status(500).json({
      data: {},
      success: false,
      message: "Cannot create a new airport",
      err: error,
    });
  }
};
const getAll = async (req, res) => {
  try {
    const response = await airportService.getAll();
    return res.status(200).json({
      data: response,
      success: true,
      message: "Airports fetched successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in getAll in airport controller");
    return res.status(500).json({
      data: {},
      success: false,
      message: "Cannot fetch airports",
      err: error,
    });
  }
};

const get = async (req, res) => {
  try {
    const response = await airportService.get(req.params.id);
    return res.status(200).json({
      data: response,
      success: true,
      message: "Airport fetched successfully",
      err: {},
    });
  } catch (error) {
    console.log("Error in get in airport controller");
    return res.status(500).json({
      data: {},
      success: false,
      message: "Cannot fetch airport",
      err: error,
    });
  }
};

module.exports = {
  create,
  getAll,
  get,
};
