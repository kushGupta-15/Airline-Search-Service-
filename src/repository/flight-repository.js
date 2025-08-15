const { Flights } = require("../models/index.js");

class FlightRepository {

    async createFlight(data) {
        try {
            const flight = await Flights.create(data);
            // console.log(flight);
            return flight;
        } catch (error) {
            console.log("Error in create flight in repository layer");
            throw error;
        }
    }
}

module.exports = FlightRepository;