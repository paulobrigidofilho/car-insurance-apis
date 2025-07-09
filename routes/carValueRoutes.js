const express = require('express');
const router = express.Router();
const { getCarValue } = require('../controllers/carValueController');

router.post('/', getCarValue);

module.exports = router;
