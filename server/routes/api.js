const express = require("express");
const apiController = require("../controllers/apiController");

const router = express.Router();

router.get("/scrape-listings", apiController.listingService);

module.exports = router;
