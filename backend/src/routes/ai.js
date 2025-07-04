const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate', aiController.generateCode);

module.exports = router;
