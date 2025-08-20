const { Flights } = require("../models/index.js");
const { Op } = require("sequelize");
class FlightRepository {
    //private filter method
    #createFilter(data) {
        let filter = {};
        if(data.arrivalAirportId) {
            filter.arrivalAirportId = data.arrivalAirportId;
        }
        if(data.departureAirportId) {
            filter.departureAirportId = data.departureAirportId;
        }
        if(data.minPrice) {
            Object.assign(filter, {price :{[Op.gte]: data.minPrice}})
        }
        if(data.maxPrice) {
            Object.assign(filter, {price :{[Op.lte]: data.maxPrice}})
        }
        return filter;
    }

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

    async getFlight(flightId) {
        try {
            const flight = await Flights.findByPk(flightId);
            return flight;
        } catch (error) {
            console.log("Error in get flight in repository layer");
            throw {error};
        }
    }
    async getAllFlights(filter) {
        try {
            const filterObject = this.#createFilter(filter);
            const flight = await Flights.findAll({
                where: filterObject
            });
            return flight;
        } catch (error) {
            console.log("Error in get all flight in repository layer");
            throw {error};
        }
    }

    async updateFlight(flightId, data) {
        try {
            await Flights.update(data, {
                where: {
                    id: flightId
                }
            });
            return true;
        } catch (error) {
            console.log("Error in updating flight in repository layer");
            throw {error};
        }
    }
}

module.exports = FlightRepository;