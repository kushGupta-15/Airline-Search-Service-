const { z } = require('zod');
const { ClientErrorCodes } = require('../utils/error-codes.js');

const createFlightSchema = z.object({
    flightNumber: z.string({ required_error: 'Flight number is required' }).min(1, 'Flight number cannot be empty'),
    airplaneId: z.coerce.number({ required_error: 'Airplane ID is required' }).int().positive('Airplane ID must be a positive integer'),
    departureAirportId: z.coerce.number({ required_error: 'Departure Airport ID is required' }).int().positive('Departure Airport ID must be a positive integer'),
    arrivalAirportId: z.coerce.number({ required_error: 'Arrival Airport ID is required' }).int().positive('Arrival Airport ID must be a positive integer'),
    arrivalTime: z.string({ required_error: 'Arrival time is required' }).min(1, 'Arrival time cannot be empty'),
    departureTime: z.string({ required_error: 'Departure time is required' }).min(1, 'Departure time cannot be empty'),
    price: z.coerce.number({ required_error: 'Price is required' }).positive('Price must be greater than zero')
});

const validateCreateFlight = (req, res, next) => {
    const result = createFlightSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for create flight',
            err: (result.error.issues || []).map(e => e.message).join(', ')
        });
    }
    next();
};

module.exports = {
    validateCreateFlight
};