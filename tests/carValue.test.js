const carValue = require('../services/carValueService');
const request = require('supertest');
jest.mock('../server', () => {
    const express = require('express');
    const carValueRoutes = require('../routes/carValueRoutes'); // Import the route
    const app = express();
    app.use(express.json());
    app.use('/api/car-value', carValueRoutes); // Register the route
    return { app }; // Mock the server to only export the app
});
const { app } = require('../server'); // Import the mocked app



// ################################ //
// ### Server setup for testing ### //
// ################################ //


// Server instance for testing - Starts the server for the tests and closes it "After all" tests.
let server; 

beforeAll(() => {
    server = app.listen();
});

afterAll(async () => {
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
});

// ######################################## //
// ### Test cases for carValue function ### //
// ######################################## //


const invalidValues = ['', ' ', null, undefined, [], {}];
const currentYear = new Date().getFullYear();



describe('carValue function tests', () => {
    test.each(invalidValues)('Check if invalid parameters throw errors %s', (value) => {
        expect(() => carValue(value, 2014)).toThrow('Model must be a string and year must be a number');
    });

    test.each(invalidValues)('Check if invalid parameters throw errors for year %s', (value) => {
        expect(() => carValue('civic', value)).toThrow('Model must be a string and year must be a number');
    });

    test('Check if invalid year throws error', () => {
        expect(() => carValue('Civic', 1885)).toThrow('Invalid year');
        expect(() => carValue('Civic', 2026)).toThrow('Invalid year');
    });

    test('Car value is correct', () => {
        expect(carValue('CIVIC', 2014)).toBe(6614); // 66 (model value) * 100 + 2014 = 6614
    });
});


// ######################################//
// ### Test cases for carValue API route //
// ######################################//

describe('Car Value Routes', () => {
    test('POST /api/car-value with valid data returns correct value', async () => {
        const response = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: 2014 });
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ value: 6614 }); // 66 (model value) * 100 + 2014 = 6614
    });
});

// ########################################################### //
// ### Test cases for carValue API route with invalid data ### //
// ########################################################### //


describe('Car Value Routes', () => {
    test('POST /api/car-value with missing model returns error', async () => {
        const response = await request(app)
            .post('/api/car-value')
            .send({ year: 2014 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Model must be a non-empty string' });
    });

    test('POST /api/car-value with invalid year returns error', async () => {
        const response = await request(app)
            .post('/api/car-value')
            .send({ model: 'Civic', year: 1885 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: `Year must be a number between 1887 and ${currentYear}` });
    });
});


