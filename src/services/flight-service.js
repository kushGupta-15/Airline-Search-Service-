const {AirplaneRepository, FlightRepository} = require('../repository/index.js');

class FlightService {

    constructor() {
        this.airplaneRepository = new AirplaneRepository();
        this.flightRepository = new FlightRepository();
    }

    async createFlight(data) {
        try {
            // console.log(data);
            // if(compareTime(data.arrivalTime, data.departureTime) > 0) {
            //     throw {error: 'Arrival time cannot be less than departure time'};
            // }
            const airplane = await this.airplaneRepository.getAirplane(data.airplaneId);
            if (!airplane) {
                throw new Error(`Airplane with ID ${data.airplaneId} not found`);
            }
            const flight = await this.flightRepository.createFlight({...data, totalSeats: airplane.capacity});
            console.log(flight);
            
            return flight;
        } catch (error) {
            console.log("Error in create flight in flight service");
            throw {error};
        }
    }

    async getFlight(flightId) {
        try {
            const flight = await this.flightRepository.getFlight(flightId);
            return flight;
        } catch (error) {
            console.log("Error in get glight in flight service");
            throw {error};
        }
    }

    async getAllFlightdata(data) {
        try {
            const flights = await this.flightRepository.getAllFlights(data);
            return flights;
        } catch (error) {
            console.log("Error in get all flights in flight service");
            throw {error};
        }
    }

    async updateFlight(flightId, data) {
        try {
            const response = await this.flightRepository.updateFlight(flightId, data);
            return response;
        } catch (error) {
            console.log("Error in get all flights in flight service");
            throw {error};
        }
    }
}

module.exports = FlightService;