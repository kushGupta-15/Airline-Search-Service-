const {Airplane} = require('../models/index.js');

class AirplaneRepository {

    async getAirplane(id) {
        try {
            const airplane = await Airplane.findByPk(id);
            return airplane;
        } catch (error) {
            console.log("Error in get Airplane in airplane repository");
            throw {error};
        }
    }
}

module.exports = AirplaneRepository;