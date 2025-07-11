const express = require("express");
const router = express.Router();
const generatorCriticController = require("../controllers/generatorCriticController");

router.post("/generator-critic", generatorCriticController.generatorCritic);

module.exports = router;
