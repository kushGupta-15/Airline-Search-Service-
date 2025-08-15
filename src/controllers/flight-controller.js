const {FlightService} = require('../services/index.js');

const flightService = new FlightService();

const create = async (req, res) => {
    try {
        const flight = await flightService.createFlight(req.body);
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

module.exports = {
    create
}