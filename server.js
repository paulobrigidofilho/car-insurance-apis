const express = require('express');
// const env = require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Routes
const carValueRoutes = require('./routes/carValueRoutes');
const riskRatingRoutes = require('./routes/riskRatingRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const discountRoutes = require('./routes/discountRoutes');

// Parse JSON requests
app.use(express.json());

// APIs
app.use('/api/car-value', carValueRoutes);
app.use('/api/risk-rating', riskRatingRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/discount', discountRoutes);

// Error handling - If route is not found - returns "Not found"
app.use((req, res, next) => {
    res.status(404).json({error: 'Not found', message: `The requested URL ${req.originalUrl} was not found`});
});

// Global error handling - Handles server errors (GPT Suggestions)
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);

    res.status(err.status || 500).json({
        error: `Internal Server Error`,
        message: err.message || `Something went wrong on the server`,
        stack: process.env.NODE_ENV === `development` ? err.stack : undefined,  // Only show stack trace in development
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);

//export app for testing
module.exports = app;