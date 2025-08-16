const {FlightService} = require('../services/index.js');

const flightService = new FlightService();

const create = async (req, res) => {
    try {
        let flightRequestData =  {
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price
        }
        const flight = await flightService.createFlight(flightRequestData);
        return res.status(201).json({
            data: flight,
            success: true,
            message: 'Flight created successfully',
            err: {}
        });
    } catch (error) {
        console.log("Error in create in flight controller");
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a flight',
            err: error
        });
    }
}

const get = async (req, res) => {
    try {
        const response = await flightService.getFlight(req.params.id);
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Flight fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log("Error in get flight in flight controller");
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to get the flight',
            err: error
        });
    }
}

const getAll = async (req, res) => {
    try {
        const response = await flightService.getAllFlightdata(req.query);
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Flights fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log("Error in get all flights in flight controller");
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to get the flights',
            err: error
        });
    }
}

module.exports = {
  create,
  getAll,
  get,
};