//========= Import Modules =========//

const express = require('express');
const router = express.Router();  // Create the router instance

//========== Controller Import ==========//

const riskRatingController = require('../controllers/riskRatingController');

//========== Routes or Endpoints ==========//

router.post('/calculate', riskRatingController.calculateRiskRatingHandler);

module.exports = router;