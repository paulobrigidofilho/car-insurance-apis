//========== Service Import ==========//
const riskRatingService = require('../services/riskRatingService');

///////////////////////////////////////////////////////////////////////
////// =============== CONTROLLER SECTION ===================== ///////
///////////////////////////////////////////////////////////////////////

/////////========== Calculate Risk Rating Handler ==========///////////

const calculateRiskRatingHandler = (req, res) => {
  
  try {

    // Extract the claim history from the request body
    const { claim_history } = req.body;

    // Check if claim history is a valid string

    if (typeof claim_history !== 'string' || claim_history.trim() === '') {
      throw new Error('Invalid claim history: must be a non-empty string.');
    }

    // ==== REGEX VALIDATION ==== //
    // Regular expression to allow only letters, numbers, spaces, and common punctuation (disallows empty strings)

    const allowedCharacters = /^[a-zA-Z0-9\s.,?!']+[a-zA-Z0-9\s.,?!']*$/;

    // Test the claim history against the regular expression

    if (!allowedCharacters.test(claim_history)) {
      throw new Error('Invalid claim history: contains disallowed characters or empty string. Only letters, numbers, spaces, and common punctuation are allowed.');
    }
    
    // Calculate the risk rating

    const riskRating = riskRatingService.calculateRiskRating(claim_history); // Call the service function to calculate the risk rating

    res.status(200).json({ risk_rating: riskRating });

  } catch (error) {
    // console.error(error); // Log errors for debugging purposes
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  calculateRiskRatingHandler,
};