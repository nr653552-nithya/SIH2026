const express = require("express");
const router = express.Router();
const heritageController = require("../controllers/heritageController");

router.get("/search", heritageController.search);
router.get("/category/:category", heritageController.getByCategory);
router.get("/:id", heritageController.getById);
router.get("/", heritageController.getAll);

module.exports = router;
