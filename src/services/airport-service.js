const CrudService = require("./crud-service.js");
const {AirportRepository} = require('../repository/index.js')


class AirportService extends CrudService {
    constructor() {
        const airportRepository = new AirportRepository();
        super(airportRepository);
    }
}

module.exports = AirportService;