//========= Import Section =========//
const request = require('supertest');
const riskRatingRoutes = require('../routes/riskRatingRoutes');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/risk-rating', riskRatingRoutes);

///////////////////////////////////////////////////////////////////////
///// ================= TEST UNITS SECTION ======================= ////
///////////////////////////////////////////////////////////////////////

describe('POST /api/risk-rating/calculate', () => {

    // ============================================== //
    // ========= Valid Inputs Section (200) ========= //
    // ============================================== //

    describe('Valid Input - String Claim History', () => {

        // ========= NORMAL CASES ========= //

        // ========= Test unit 1:  Basic example - Low Risk ========= // Normal Case

        test('Test Unit 1: should return 200 OK and a risk rating of 1 = "bump"', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "I had a minor bump in the parking lot. There was minimal damage." });

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(1); // 'bump' = 1
        });

        // ========= Test unit 2: Empty claim history ========= // Normal Case

        test('Test Unit 2: should return 200 OK and a risk rating of 0 for an empty claim history', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "The day is beautiful" });

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(0);
        });

        // ========= BOUNDARY CASES ========= //

        // ========= Test unit 3: Reaching the Maximum Risk Rating | riskRating Max = 5 ========= // Boundary Case

        // =============================== Error encountered: =================================== // 
        // This test encountered an error due to the absence of a maximum risk rating, 
        // resulting in a value of 6 when the maximum should have been 5.
        // To resolve this issue, I added a conditional statement to limit the risk rating to a maximum of 5.

        test('Test Unit 3: should return 200 OK and a risk rating limited to 5 for a severe multi-incident history', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "Multiple crashes and collisions resulting in significant scratches and dents. There was also a fender bender with another mishap." });

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(5); 
        });

        // ========= Test unit 4: High Risk with Total Loss Keyword ========= // Boundary Case

        test('Test Unit 4: should return 200 OK and a risk rating of 5 for serious accident description = "total loss"', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "The car suffered total loss." });

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(5); // 'total loss' = 5
        });

        // ========= EDGE CASES ========= //

        // ========= Test unit 5: Moderate Risk with Typo ========= // Edge Case

        test('Test Unit 5: should return 200 OK and a risk rating of 2 for a moderate claim with a typo = "crrash" and "scrratch"', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "I had a crrash on the highway. Scrratch on the car"});

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(2); // 'crashes' and 'scratch' = 2
        });

        // ========= Test unit 6: Moderate Risk with Sentence on Past Tense ========= // Edge Case

        // ======================== Error encountered: ============================== // 
        // The test was generating an error because the implemented logic counted "collided" 
        // as 2 (similar to "dented"), resulting in a total risk rating of 4. Since all the 
        // keywords were grouped together, "collided" was counted twice (as "collide" + "collided"). 
        // To resolve this issue, I created an object containing each keyword along with its 
        // variations in an array. I then iterated through the object and checked if any variation
        // of the base keyword was found in the claim history. This approach allowed me to count
        // each keyword only once, regardless of the variation used.
        
        test('Test Unit 6: should return 200 OK and a risk rating of 2 for a moderate claim = "collided" and "dented"', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "My car collided resulting in a dented door." });

            expect(response.statusCode).toBe(200);
            expect(response.body.risk_rating).toBe(2);
        });
    });

    // ================================================ //
    // ========= Invalid Inputs Section (400) ========= //
    // ================================================ //

    describe('Invalid Input - String Validation', () => {

        // ========= ERROR CASES ========= //

        // ========= Test unit 7: Invalid claim history (not a string) ========= // Error Case

        test('Test Unit 7: should return 400 Bad Request and an error message for an invalid claim history (not a string)', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: 123 }); // Invalid input (not a string)

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid claim history: must be a non-empty string.');
        });


        // ========= Test unit 8: Invalid input - Regex Violation (Invalid Characters) ========= // Error Case
        
        test('Test Unit 8: should return 400 Bad Request for invalid characters in claim history.', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "This claim has an invalid character: ~" });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid claim history: contains disallowed characters or empty string. Only letters, numbers, spaces, and common punctuation are allowed.');
        });

        // ========= Test unit 9: Invalid input - Regex Violation (Empty String) ========= // Error Case
        
        test('Test Unit 9: should return 400 Bad Request for empty strings', async () => {
            const response = await request(app)
                .post('/api/risk-rating/calculate')
                .send({ claim_history: "" });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid claim history: must be a non-empty string.');
        });
    });
});