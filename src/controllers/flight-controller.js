const {SuccessErrorCodes} = require('../utils/error-codes.js');
const {FlightService} = require('../services/index.js');
const cache = require('../utils/cache.js');

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
        await cache.delPattern('flights:all:*');
        return res.status(SuccessErrorCodes.CREATED).json({
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
        const cacheKey = `flight:${req.params.id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(SuccessErrorCodes.OK).json({
                data: cached,
                success: true,
                message: "Flight fetched successfully (cached)",
                err: {},
            });
        }

        const response = await flightService.getFlight(req.params.id);
        if (response) {
            await cache.set(cacheKey, response, 60);
        }
        res.setHeader('X-Cache', 'MISS');
        return res.status(SuccessErrorCodes.OK).json({
          data: response,
          success: true,
          message: "Flight fetched successfully",
          err: {},
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
        const cacheKey = `flights:all:${JSON.stringify(req.query)}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(SuccessErrorCodes.OK).json({
                data: cached,
                success: true,
                message: 'Flights fetched successfully (cached)',
                err: {}
            });
        }

        const response = await flightService.getAllFlightdata(req.query);
        if (response) {
            await cache.set(cacheKey, response, 60);
        }
        res.setHeader('X-Cache', 'MISS');
        return res.status(SuccessErrorCodes.OK).json({
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

const update = async (req, res) => {
    try {
        const response = await flightService.updateFlight(req.params.id, req.body);
        await cache.del(`flight:${req.params.id}`);
        await cache.delPattern('flights:all:*');
        return res.status(SuccessErrorCodes.OK).json({
            data: response,
            success: true,
            message: 'Flight updated successfully',
            err: {}
        });
    } catch (error) {
        console.log("Error in update in flight controller");
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to update the flights',
            err: error
        });
    }
}

module.exports = {
  create,
  getAll,
  get,
  update
};