const carValue = require('../services/carValueService');
const currentYear = new Date().getFullYear();

const getCarValue = (req, res) => {
    try {
        const { model, year } = req.body;

        // Validation for the model
        if (!model || typeof model !== 'string' || model.trim() === '') {
            return res.status(400).json({ error: 'Model must be a non-empty string' });
        }

        // Validation for the year
        if (typeof year !== 'number' || year < 1887 || year > currentYear) {
            return res.status(400).json({ error: `Year must be a number between 1887 and ${currentYear}` });
        }

        // if validation ok,  call the service
        const result = carValue(model, year);
        return res.status(200).json({ value: result });
    } catch (error) {
        // Log error on the server
        console.error('Error occurred:', error);

        // Send response with error message
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getCarValue };



