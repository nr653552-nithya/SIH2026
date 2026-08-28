const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");

router.get("/", languageController.getAll);

module.exports = router;
