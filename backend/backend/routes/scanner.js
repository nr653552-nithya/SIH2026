const express = require("express");
const router = express.Router();
const scannerController = require("../controllers/scannerController");

router.get("/:qrCode", scannerController.lookupQr);

module.exports = router;
