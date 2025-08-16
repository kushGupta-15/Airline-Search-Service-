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
module.exports = {
  create,
};
