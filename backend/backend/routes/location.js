const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/nearby", locationController.getNearby);

module.exports = router;
